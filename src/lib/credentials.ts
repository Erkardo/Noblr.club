import type { Application } from '../types';

/**
 * Issue a fresh set of member credentials for an approved application.
 *
 * Member numbers increment from the current highest issued number. We pull
 * the sequence from the live `applications` list (same data the admin is
 * looking at) to avoid a separate counter that could drift from reality.
 * Dispatch code mirrors the member number to make it easy to remember.
 * Dispatch key is an 8-character alphanumeric — short enough to type,
 * long enough that the odds of a brute match on LoginView are nil.
 */
export interface IssuedCredentials {
  memberNumber: string;   // "No. 0249"
  dispatchCode: string;   // "NBLR-0249"
  dispatchKey: string;    // "X7K2QMPR"
}

const BASE_MEMBER_NUMBER = 247; // the seed member, Түмэн-Эрдэнэ

function nextSequence(applications: Application[]): number {
  let maxIssued = BASE_MEMBER_NUMBER;
  for (const app of applications) {
    if (!app.memberNumber) continue;
    const m = app.memberNumber.match(/(\d+)/);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n > maxIssued) maxIssued = n;
  }
  return maxIssued + 1;
}

function randomKey(length = 8): string {
  // Omit similar-looking glyphs (0/O, 1/I) so the key stays readable
  // when transcribed from the email.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function issueCredentials(applications: Application[]): IssuedCredentials {
  const seq = nextSequence(applications);
  const padded = String(seq).padStart(4, '0');
  return {
    memberNumber: `No. ${padded}`,
    dispatchCode: `NBLR-${padded}`,
    dispatchKey: randomKey(8),
  };
}
