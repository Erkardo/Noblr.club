import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { renderInviteEmail } from './_email-template';

/**
 * POST /api/send-invite
 *
 * Delivers a welcome email to an approved applicant with their fresh
 * credentials (member number, dispatch code, dispatch key) and a login
 * link. This runs as a Vercel serverless function so the Resend API key
 * stays server-side — never shipped in the browser bundle.
 *
 * Body schema:
 *   applicantEmail:        string  — where to deliver
 *   applicantName:         string  — for greeting
 *   memberNumber:          string  — "No. 0249"
 *   dispatchCode:          string  — "NBLR-0249"
 *   dispatchKey:           string  — welcome key (8 chars)
 *   sponsorMemberNumber?:  string
 *   sponsorName?:          string
 *
 * Responses:
 *   200 { ok: true, id: <resend message id> }
 *   400 { error: "<validation message>" }
 *   500 { error: "<provider error>" }
 */

interface SendInviteBody {
  applicantEmail?: string;
  applicantName?: string;
  memberNumber?: string;
  dispatchCode?: string;
  dispatchKey?: string;
  sponsorMemberNumber?: string;
  sponsorName?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS: the Vite client calls this from the same origin in production
  // (Vercel hosts both). In local dev via `vercel dev` the call is also
  // same-origin. We reject anything that isn't POST.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured on the server.' });
  }

  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const replyTo = process.env.RESEND_REPLY_TO;

  const body = (req.body || {}) as SendInviteBody;
  const {
    applicantEmail,
    applicantName,
    memberNumber,
    dispatchCode,
    dispatchKey,
    sponsorMemberNumber,
    sponsorName,
  } = body;

  // Validate
  if (!applicantEmail || !EMAIL_RE.test(applicantEmail)) {
    return res.status(400).json({ error: 'applicantEmail is missing or not a valid email.' });
  }
  if (!memberNumber || !dispatchCode || !dispatchKey) {
    return res.status(400).json({ error: 'memberNumber, dispatchCode, and dispatchKey are required.' });
  }

  // Build login URL — prefer explicit env, else request origin, else noblr.club.
  const appUrl =
    process.env.APP_URL ||
    (req.headers.origin as string | undefined) ||
    (req.headers.host ? `https://${req.headers.host}` : 'https://noblr.club');
  const loginUrl = `${appUrl.replace(/\/$/, '')}/#login`;

  const { subject, html, text } = renderInviteEmail({
    applicantName: applicantName || 'гишүүн',
    memberNumber,
    dispatchCode,
    dispatchKey,
    sponsorMemberNumber,
    sponsorName,
    loginUrl,
  });

  const resend = new Resend(apiKey);

  try {
    // "The Noblr Committee" is the brand voice for decision emails —
    // other notification types (weekly dossier, events) should set their
    // own From display name while keeping the underlying address the
    // same. That way every Noblr message lands from one sender and
    // recipients learn to trust the thread.
    const result = await resend.emails.send({
      from: `The Noblr Committee <${from}>`,
      to: [applicantEmail],
      replyTo: replyTo || undefined,
      subject,
      html,
      text,
      headers: {
        // Make replies thread cleanly, and hint to spam filters this is
        // transactional (not marketing).
        'X-Entity-Ref-ID': `noblr-invite-${memberNumber.replace(/\D/g, '')}`,
      },
      tags: [
        { name: 'category', value: 'invite' },
        { name: 'memberNumber', value: memberNumber.replace(/\s+/g, '_') },
      ],
    });

    if (result.error) {
      return res.status(500).json({ error: result.error.message || 'Resend rejected the send.' });
    }

    return res.status(200).json({ ok: true, id: result.data?.id ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
