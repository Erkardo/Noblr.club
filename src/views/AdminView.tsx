import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, ArrowUpDown, Check, Copy, Download, Mail, RotateCcw, Search, Sparkles, Undo2, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateText, isGeminiAvailable } from '../services/gemini';
import { issueCredentials } from '../lib/credentials';
import type { Accord, Application } from '../types';

const BRIEF_SYSTEM = `You are advising the Noblr private society's admissions committee. Given a candidate dossier, produce a concise brief in Mongolian Cyrillic with exactly three sections: "Давуу тал" (2-3 bullet points), "Анхаарах" (2-3 bullet points), and "Зөвлөмж" (one-line recommendation: Accept / Hold / Decline with a short justification). Tone: Monocle-level measured editorial, confident but not flattering. Keep the entire brief under 140 words.`;

const INVITE_LIFETIME_CAP = 5;

type AdminFilter = 'pending' | 'sponsored' | 'walkin' | 'approved' | 'rejected';

export function AdminView() {
  const {
    applications, setApplications, resetDemoData,
    invites, setInvites, currentMember, setCurrentMember,
    setVerifiedAccords,
  } = useAppContext();
  const firstPendingId = applications.find(a => a.status === 'PENDING')?.id ?? applications[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(firstPendingId);
  const [brief, setBrief] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdminFilter>('pending');
  const [search, setSearch] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  // Track in-flight invite email sends per application ID so the UI
  // can show a spinner on the right app — multiple apps can be mid-send
  // if an admin burns through the queue fast.
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  // Transient "Copied" flash for the credentials clipboard action.
  const [copiedFlash, setCopiedFlash] = useState<string | null>(null);
  const selected = applications.find(a => a.id === selectedId) ?? null;
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const sponsoredPendingCount = applications.filter(a => a.status === 'PENDING' && !!a.inviteCode).length;
  const walkinPendingCount = applications.filter(a => a.status === 'PENDING' && !a.inviteCode).length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;
  const geminiReady = isGeminiAvailable();

  const filtered = (() => {
    let list: Application[];
    switch (filter) {
      case 'pending':   list = applications.filter(a => a.status === 'PENDING'); break;
      case 'sponsored': list = applications.filter(a => !!a.inviteCode); break;
      case 'walkin':    list = applications.filter(a => !a.inviteCode); break;
      case 'approved':  list = applications.filter(a => a.status === 'APPROVED'); break;
      case 'rejected':  list = applications.filter(a => a.status === 'REJECTED'); break;
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    // sort by original index as proxy for recency (newer apps are prepended)
    const indexMap = new Map(applications.map((a, i) => [a.id, i]));
    list.sort((a, b) => {
      const ai = indexMap.get(a.id) ?? 0;
      const bi = indexMap.get(b.id) ?? 0;
      return sortNewest ? ai - bi : bi - ai;
    });
    return list;
  })();

  const handleExportCSV = () => {
    const headers = ['id', 'name', 'age', 'position', 'company', 'status', 'date', 'education', 'experience', 'email', 'phone', 'instagram', 'facebook', 'linkedin', 'inviteCode', 'sponsorMemberNumber', 'sponsorName'];
    const rows = filtered.map(a => headers.map(h => {
      const v = (a as unknown as Record<string, unknown>)[h];
      if (v == null) return '';
      return String(v).replace(/"/g, '""');
    }));
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noblr-applications-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Call the server-side invite dispatcher. Kept out of handleDecision
   * so it can also be invoked as a "Resend" action from the detail pane
   * without re-running the approval side effects.
   */
  const dispatchInvite = async (app: Application): Promise<{ ok: boolean; error?: string }> => {
    if (!app.email) {
      return { ok: false, error: 'Applicant email missing — cannot dispatch.' };
    }
    if (!app.memberNumber || !app.dispatchCode || !app.dispatchKey) {
      return { ok: false, error: 'Credentials missing on application.' };
    }
    try {
      const res = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantEmail: app.email,
          applicantName: app.name,
          memberNumber: app.memberNumber,
          dispatchCode: app.dispatchCode,
          dispatchKey: app.dispatchKey,
          sponsorMemberNumber: app.sponsorMemberNumber,
          sponsorName: app.sponsorName,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        return { ok: false, error: payload.error || `HTTP ${res.status}` };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  };

  const handleResendInvite = async (app: Application) => {
    setSendingIds(prev => new Set(prev).add(app.id));
    const result = await dispatchInvite(app);
    setApplications(prev => prev.map(a =>
      a.id === app.id
        ? {
            ...a,
            emailSentAt: result.ok ? Date.now() : a.emailSentAt ?? null,
            emailError: result.ok ? undefined : result.error,
          }
        : a
    ));
    setSendingIds(prev => {
      const next = new Set(prev);
      next.delete(app.id);
      return next;
    });
  };

  /**
   * Legacy path: the Committee approved this application before we wired up
   * the invite system. There are no credentials on file, so Resend has
   * nothing to send. This handler mints credentials in-place and then
   * dispatches — one click from "just a status flag" to "delivered."
   */
  const handleIssueAndSend = async (app: Application) => {
    const creds = issueCredentials(applications);
    const updated: Application = {
      ...app,
      memberNumber: creds.memberNumber,
      dispatchCode: creds.dispatchCode,
      dispatchKey: creds.dispatchKey,
      emailSentAt: null,
      emailError: undefined,
    };
    setApplications(prev => prev.map(a => a.id === app.id ? updated : a));

    setSendingIds(prev => new Set(prev).add(app.id));
    const result = await dispatchInvite(updated);
    setApplications(prev => prev.map(a =>
      a.id === app.id
        ? {
            ...a,
            emailSentAt: result.ok ? Date.now() : null,
            emailError: result.ok ? undefined : result.error,
          }
        : a
    ));
    setSendingIds(prev => {
      const next = new Set(prev);
      next.delete(app.id);
      return next;
    });
  };

  const handleCopyCredentials = async (app: Application) => {
    if (!app.memberNumber || !app.dispatchCode || !app.dispatchKey) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://noblr.club';
    const block = [
      `Noblr — Member credentials`,
      ``,
      `Member Number:   ${app.memberNumber}`,
      `Dispatch Code:   ${app.dispatchCode}`,
      `Dispatch Key:    ${app.dispatchKey}`,
      ``,
      `Login:           ${origin}/#login`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(block);
      setCopiedFlash(app.id);
      setTimeout(() => setCopiedFlash(prev => (prev === app.id ? null : prev)), 2000);
    } catch {
      // Clipboard API can fail in non-secure contexts; fall back to
      // nothing (we don't want to disturb the admin with a prompt).
    }
  };

  /**
   * Undo a decision. Clears credentials and email state so reverting to
   * PENDING gives the Committee a truly clean re-review — not a ghost
   * "already sent" flag on a now-undecided dossier. The sponsored-invite
   * side-effects from the original decision are deliberately NOT unwound
   * (sponsor quota changes, accord creation) — that's a separate, more
   * invasive cleanup the admin can do manually if needed.
   */
  const handleRevertToPending = (app: Application) => {
    if (!window.confirm('Буцаах уу? Credentials болон email статус арилна. Decision flag дахин PENDING болно.')) return;
    setApplications(prev => prev.map(a =>
      a.id === app.id
        ? {
            ...a,
            status: 'PENDING',
            memberNumber: undefined,
            dispatchCode: undefined,
            dispatchKey: undefined,
            emailSentAt: undefined,
            emailError: undefined,
          }
        : a
    ));
    setBrief(null);
    setBriefError(null);
  };

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!selectedId) return;
    const app = applications.find(a => a.id === selectedId);
    if (!app) return;

    // On approval, mint credentials synchronously so the update to
    // `applications` carries them — the email dispatcher reads them back
    // off the app object, and the Waitlist view shows them (masked) to
    // the applicant on return.
    let updatedApp: Application = { ...app, status: decision };
    if (decision === 'APPROVED' && !app.memberNumber) {
      const creds = issueCredentials(applications);
      updatedApp = {
        ...updatedApp,
        memberNumber: creds.memberNumber,
        dispatchCode: creds.dispatchCode,
        dispatchKey: creds.dispatchKey,
        emailSentAt: null,
      };
    }

    setApplications(prev => prev.map(a => a.id === selectedId ? updatedApp : a));

    // If this application was sponsored, update the invite outcome and
    // restore the inviter's quota on acceptance.
    if (app.inviteCode) {
      const inviteCode = app.inviteCode;
      const matchedInvite = invites.find(i => i.code === inviteCode);
      const inviteOutcome = decision === 'APPROVED' ? 'ACCEPTED' : 'REJECTED';
      setInvites(prev => prev.map(inv =>
        inv.code === inviteCode
          ? { ...inv, outcome: inviteOutcome }
          : inv
      ));
      if (decision === 'APPROVED' && matchedInvite && matchedInvite.issuedByMemberId === currentMember.id) {
        setCurrentMember(prev => {
          const nextRemaining = Math.min(INVITE_LIFETIME_CAP - prev.invitesEverIssued + (prev.invitesRemaining + 1), prev.invitesRemaining + 1);
          // Count accepted sponsorships AFTER this decision
          const acceptedSoFar = invites.filter(i => i.issuedByMemberId === prev.id && i.outcome === 'ACCEPTED').length + 1;
          const nowPatron = prev.patronSince ?? (acceptedSoFar >= 3 ? Date.now() : null);
          return {
            ...prev,
            invitesRemaining: nextRemaining,
            patronSince: nowPatron,
          };
        });

        // Auto-create a verified accord between sponsor and the newly approved
        // member so sponsor sees them in Introductions.
        const newAccord: Accord = {
          id: app.id.replace('A-', ''),
          name: app.name,
          role: app.position || '—',
          intent: 'Sponsored Introduction',
          unread: true,
          status: 'Pending Exchange',
          dispatch: `${app.name} таны spon-оор орсон шинэ гишүүн. Тавтай морилно уу.`,
          coordinates: null,
        };
        setVerifiedAccords(prev => [newAccord, ...prev]);
      }
    }

    const nextPending = applications.find(a => a.status === 'PENDING' && a.id !== selectedId);
    setSelectedId(nextPending?.id ?? null);
    setBrief(null);
    setBriefError(null);

    // Dispatch the welcome email asynchronously. We don't block the admin
    // on this — UI updates immediately with status=APPROVED, and the email
    // lands (or errors) a moment later, at which point a small indicator
    // in the detail pane reflects the outcome.
    if (decision === 'APPROVED' && updatedApp.email) {
      setSendingIds(prev => new Set(prev).add(updatedApp.id));
      const result = await dispatchInvite(updatedApp);
      setApplications(prev => prev.map(a =>
        a.id === updatedApp.id
          ? {
              ...a,
              emailSentAt: result.ok ? Date.now() : null,
              emailError: result.ok ? undefined : result.error,
            }
          : a
      ));
      setSendingIds(prev => {
        const next = new Set(prev);
        next.delete(updatedApp.id);
        return next;
      });
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedId(id);
    setBrief(null);
    setBriefError(null);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all demo data? This restores default applications, introductions, and profile preferences.')) return;
    resetDemoData();
    setSelectedId(null);
    setBrief(null);
    setBriefError(null);
  };

  const handleGenerateBrief = async () => {
    if (!selected) return;
    setBriefLoading(true);
    setBriefError(null);
    setBrief(null);
    try {
      const prompt = `Candidate dossier:\nName: ${selected.name}\nAge: ${selected.age}\nRole: ${selected.position}\nCompany: ${selected.company}\nLinkedIn: ${selected.linkedin ?? '—'}\nIntent statement: "${selected.intentStatement ?? '—'}"\n\nProduce the committee brief now.`;
      const result = await generateText(prompt, BRIEF_SYSTEM);
      setBrief(result.trim());
    } catch (err: unknown) {
      setBriefError(err instanceof Error ? err.message : 'AI хариу өгч чадсангүй.');
    } finally {
      setBriefLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full max-w-6xl mx-auto py-6 md:py-8 z-20 px-4 md:px-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-accent-20 pb-6 mb-8 gap-4">
        <div>
          <h2 className="font-display text-3xl font-light text-text-main mb-2">Review Committee</h2>
          <p className="font-serif italic text-text-dim text-[14px]">Evaluation Dashboard</p>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={handleReset}
            title="Reset demo data"
            className="font-caps text-[9px] tracking-[0.2em] text-text-dim/60 uppercase hover:text-[#FF4A4A] transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <div className="font-caps text-[10px] tracking-[0.2em] text-accent uppercase">
             {pendingCount + 139} Pending Profiles
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {([
          { key: 'pending',   label: 'Pending',   count: pendingCount },
          { key: 'sponsored', label: 'Sponsored', count: sponsoredPendingCount > 0 ? sponsoredPendingCount : applications.filter(a => !!a.inviteCode).length },
          { key: 'walkin',    label: 'Walk-ins',  count: walkinPendingCount > 0 ? walkinPendingCount : applications.filter(a => !a.inviteCode).length },
          { key: 'approved',  label: 'Approved',  count: approvedCount },
          { key: 'rejected',  label: 'Rejected',  count: rejectedCount },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-2 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${filter === tab.key ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
          >
            {tab.label}
            <span className={`font-sans text-[10px] tabular-nums ${filter === tab.key ? 'text-accent' : 'text-text-dim/60'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search + sort + export */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center border border-accent-20 focus-within:border-accent transition-colors px-3">
          <Search className="w-3.5 h-3.5 text-text-dim shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Нэр, компани, албан тушаал, ID..."
            className="flex-1 py-2 ml-2 text-[13px] text-text-main placeholder-text-dim/40 font-sans font-light bg-transparent border-0 outline-none focus:ring-0"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-text-dim hover:text-text-main" aria-label="Clear">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setSortNewest(s => !s)}
          className="font-caps text-[10px] tracking-[0.2em] text-text-dim hover:text-text-main uppercase border border-accent-20 hover:border-accent px-4 py-2 transition-colors flex items-center gap-2"
          title="Toggle sort order"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortNewest ? 'Newest' : 'Oldest'}
        </button>
        <button
          onClick={handleExportCSV}
          disabled={filtered.length === 0}
          className="font-caps text-[10px] tracking-[0.2em] text-text-dim hover:text-accent uppercase border border-accent-20 hover:border-accent px-4 py-2 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-3 h-3" />
          CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
        <div className="border border-accent-20 bg-bg-base/30 backdrop-blur-sm overflow-hidden h-fit">
          <div className="hidden md:grid grid-cols-[100px_1fr_1fr_1fr_80px] gap-4 p-4 border-b border-accent-20 bg-accent/5 font-caps text-[9px] uppercase tracking-[0.2em] text-text-dim">
            <div>ID</div>
            <div>Applicant</div>
            <div>Role</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-accent-20">
            {filtered.length === 0 && (
              <div className="p-8 text-center font-serif italic text-text-dim text-[13px]">
                Энэ ангилалд өргөдөл алга.
              </div>
            )}
            {filtered.map((app) => {
              const isSelected = app.id === selectedId;
              const isDecided = app.status !== 'PENDING';
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectRow(app.id)}
                  className={`grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_1fr_80px] gap-4 p-4 items-center cursor-pointer group transition-colors ${isSelected ? 'bg-accent/10' : 'hover:bg-white/5'} ${isDecided ? 'opacity-50' : ''}`}
                >
                  <div className="font-sans text-[11px] text-text-dim flex items-center gap-2">
                    {app.id}
                    {app.inviteCode && (
                      <span className="font-caps text-[7px] tracking-[0.15em] text-accent uppercase border border-accent/40 px-1.5 py-[1px]" title={`Sponsored by ${app.sponsorMemberNumber} · ${app.sponsorName}`}>
                        SPON
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={`font-sans font-light text-text-main text-[14px] ${isDecided ? 'line-through' : ''}`}>{app.name}, {app.age}</div>
                  </div>
                  <div>
                    <div className="font-serif italic text-[13px] text-text-dim truncate pr-4">{app.position}</div>
                    <div className="font-sans text-[10px] text-text-dim/60 truncate pr-4">{app.company}</div>
                  </div>
                  <div className={`font-caps text-[9px] tracking-[0.2em] uppercase ${app.status === 'APPROVED' ? 'text-accent' : app.status === 'REJECTED' ? 'text-[#FF4A4A]' : 'text-text-dim'}`}>
                    {app.status === 'PENDING' ? app.date : app.status}
                  </div>
                  <div className="flex justify-start md:justify-end opacity-50 md:opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent-20 bg-[#0E0C0A] p-5 md:p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none translate-x-10 -translate-y-10" />
          <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase mb-6 relative z-10">Application Details</div>

          {selected ? (
            <>
              <h3 className="font-display text-3xl md:text-4xl font-light text-text-main mb-1 relative z-10">{selected.name}, {selected.age}</h3>
              <div className="font-serif italic text-text-dim text-[14px] mb-4 md:mb-6 relative z-10">{selected.position} @ {selected.company}</div>

              {selected.inviteCode && (
                <div className="mb-6 md:mb-8 relative z-10 border border-accent/30 bg-accent/5 px-4 py-3 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <div className="flex-1 min-w-0">
                    <div className="font-caps text-[8px] tracking-[0.3em] text-accent uppercase mb-0.5">Sponsored by</div>
                    <div className="font-sans text-[12px] text-text-main truncate">
                      {selected.sponsorMemberNumber ?? '—'} · <span className="italic text-text-dim">{selected.sponsorName ?? '—'}</span>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-text-dim tracking-widest shrink-0 hidden sm:block">
                    {selected.inviteCode}
                  </div>
                </div>
              )}

              <div className="space-y-6 flex-1 relative z-10">
                {(selected.experience || selected.education) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selected.experience && (
                      <div>
                        <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mb-1">Карерын нас</div>
                        <div className="font-sans text-[13px] text-text-main">{selected.experience} жил</div>
                      </div>
                    )}
                    {selected.education && (
                      <div>
                        <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mb-1">Боловсрол</div>
                        <div className="font-sans text-[13px] text-text-main">{selected.education}</div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Intent Statement</div>
                  <p className="font-serif font-light text-[14px] leading-[1.8] text-text-main/80 italic">
                    "{selected.intentStatement ?? '—'}"
                  </p>
                </div>

                {selected.influences && (
                  <div>
                    <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Reflective</div>
                    <p className="font-serif font-light text-[14px] leading-[1.8] text-text-main/80 italic">
                      "{selected.influences}"
                    </p>
                  </div>
                )}

                <div>
                  <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Social</div>
                  <div className="flex flex-col gap-1.5 font-sans text-[12px]">
                    {selected.instagram && (
                      <a href={`https://${selected.instagram}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{selected.instagram}</a>
                    )}
                    {selected.facebook && (
                      <a href={`https://${selected.facebook}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{selected.facebook}</a>
                    )}
                    {selected.linkedin && (
                      <a href={`https://${selected.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{selected.linkedin}</a>
                    )}
                    {!selected.instagram && !selected.facebook && !selected.linkedin && <span className="text-text-dim">—</span>}
                  </div>
                </div>

                {(selected.phone || selected.email || selected.gender || selected.birthday) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selected.birthday && (
                      <div>
                        <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mb-1">Төрсөн өдөр</div>
                        <div className="font-mono text-[12px] text-text-main">{selected.birthday}</div>
                      </div>
                    )}
                    {selected.gender && (
                      <div>
                        <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mb-1">Хүйс</div>
                        <div className="font-sans text-[13px] text-text-main">{selected.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}</div>
                      </div>
                    )}
                    {selected.phone && (
                      <div>
                        <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mb-1">Утас</div>
                        <div className="font-mono text-[12px] text-text-main tracking-wide break-all">{selected.phone}</div>
                      </div>
                    )}
                    {selected.email && (
                      <div>
                        <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mb-1">Имэйл</div>
                        <div className="font-mono text-[12px] text-text-main break-all">{selected.email}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selected.status === 'PENDING' ? (
                <div className="mt-12 pt-6 border-t border-accent-20 relative z-10 space-y-4">
                  <button
                    onClick={handleGenerateBrief}
                    disabled={!geminiReady || briefLoading}
                    title={geminiReady ? 'Gemini-ээр дүгнэлт бичүүлэх' : 'Gemini API key тохируулаагүй'}
                    className="w-full border border-accent/30 bg-accent/5 py-3 text-[10px] font-caps tracking-[0.2em] text-accent uppercase hover:bg-accent/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3 h-3" />
                    {briefLoading ? 'Дүгнэж байна...' : 'Generate Committee Brief'}
                  </button>
                  {briefError && <div className="font-sans text-[11px] text-[#FF4A4A]">{briefError}</div>}
                  {brief && (
                    <div className="border border-accent/20 bg-[#0A0A0A] p-5 font-serif text-[13px] leading-[1.8] text-text-main/80 whitespace-pre-wrap">
                      {brief}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => handleDecision('REJECTED')}
                      className="w-full sm:flex-1 border border-accent-20 py-4 text-[10px] font-caps tracking-[0.2em] text-text-dim uppercase hover:bg-white/5 hover:text-[#FF4A4A] transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-3 h-3" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecision('APPROVED')}
                      className="w-full sm:flex-1 bg-accent text-bg-base py-4 text-[10px] font-caps tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-12 pt-6 border-t border-accent-20 relative z-10 space-y-5">
                  <div className={`font-caps text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 py-3 ${selected.status === 'APPROVED' ? 'text-accent' : 'text-[#FF4A4A]'}`}>
                    {selected.status === 'APPROVED' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {selected.status}
                  </div>

                  {selected.status === 'APPROVED' && !selected.memberNumber && (
                    /* Legacy approved — no credentials yet */
                    <div className="border border-accent/30 bg-gradient-to-b from-accent/[0.08] via-transparent to-transparent p-5 space-y-4">
                      <div className="font-caps text-[9px] tracking-[0.25em] text-accent uppercase">
                        Credentials хараахан олгогдоогүй
                      </div>
                      <p className="font-serif italic text-[13px] text-text-dim leading-relaxed">
                        Энэ dossier-ийг Resend системийг холбохоос өмнө хорооноос зөвшөөрсөн.
                        Одоо member number, dispatch code, dispatch key үүсгээд welcome email-ийг илгээж болно.
                      </p>
                      <button
                        onClick={() => handleIssueAndSend(selected)}
                        disabled={sendingIds.has(selected.id) || !selected.email}
                        title={!selected.email ? 'Applicant email missing' : ''}
                        className="w-full bg-accent text-bg-base py-3 text-[10px] font-caps tracking-[0.25em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Mail className="w-3 h-3" />
                        {sendingIds.has(selected.id) ? 'Dispatching...' : 'Issue credentials & send'}
                      </button>
                      {!selected.email && (
                        <div className="font-sans text-[11px] text-[#FF4A4A] border-l-2 border-[#FF4A4A]/60 pl-3 py-1">
                          Applicant email дутмал — файл эвдэрсэн эсвэл хуучин демо өргөдөл. Буцаагаад дахин авах шаардлагатай.
                        </div>
                      )}
                    </div>
                  )}

                  {selected.status === 'APPROVED' && selected.memberNumber && (
                    <div className="border border-accent/20 bg-[#0A0A0A] p-5 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div className="font-caps text-[9px] tracking-[0.25em] text-accent uppercase">
                          Issued credentials
                        </div>
                        {selected.emailSentAt ? (
                          <div className="font-caps text-[9px] tracking-[0.2em] text-accent/70 uppercase flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Sent {formatRelativeTime(selected.emailSentAt)}
                          </div>
                        ) : sendingIds.has(selected.id) ? (
                          <div className="font-caps text-[9px] tracking-[0.2em] text-accent/70 uppercase flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full border border-accent border-t-transparent animate-spin" />
                            Dispatching
                          </div>
                        ) : selected.emailError ? (
                          <div className="font-caps text-[9px] tracking-[0.2em] text-[#FF4A4A] uppercase">
                            Failed
                          </div>
                        ) : (
                          <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase">
                            Queued
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <CredRow label="Member Number" value={selected.memberNumber} mono={false} />
                        {selected.dispatchCode && <CredRow label="Dispatch Code" value={selected.dispatchCode} mono />}
                        {selected.dispatchKey && <CredRow label="Dispatch Key" value={selected.dispatchKey} mono />}
                      </div>

                      {selected.emailError && (
                        <div className="font-sans text-[11px] text-[#FF4A4A] border-l-2 border-[#FF4A4A]/60 pl-3 py-1 leading-relaxed break-words">
                          {selected.emailError}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleResendInvite(selected)}
                          disabled={sendingIds.has(selected.id) || !selected.email}
                          title={!selected.email ? 'Applicant email missing' : ''}
                          className="border border-accent/30 bg-accent/5 py-3 text-[10px] font-caps tracking-[0.2em] text-accent uppercase hover:bg-accent/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Mail className="w-3 h-3" />
                          {sendingIds.has(selected.id)
                            ? 'Sending...'
                            : selected.emailSentAt
                            ? 'Resend email'
                            : selected.emailError
                            ? 'Retry send'
                            : 'Send email'}
                        </button>
                        <button
                          onClick={() => handleCopyCredentials(selected)}
                          className="border border-accent-20 py-3 text-[10px] font-caps tracking-[0.2em] text-text-main uppercase hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedFlash === selected.id ? (
                            <><Check className="w-3 h-3 text-accent" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy block</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Secondary destructive action — revert to PENDING.
                     Kept visually quiet so it isn't a one-click accident. */}
                  <div className="pt-3 flex items-center justify-between">
                    <div className="font-caps text-[8px] tracking-[0.25em] text-text-dim/60 uppercase">
                      {selected.status === 'APPROVED' ? 'Mistake? Revert to re-review.' : 'Reconsider? Send back to queue.'}
                    </div>
                    <button
                      onClick={() => handleRevertToPending(selected)}
                      className="font-caps text-[9px] tracking-[0.25em] text-text-dim hover:text-text-main uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <Undo2 className="w-3 h-3" />
                      Revert to pending
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 py-20">
              <div className="font-display text-2xl font-light text-text-main mb-2">Queue Cleared</div>
              <div className="font-serif italic text-text-dim text-[14px]">No applications awaiting review.</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ————— helpers ————— */

function CredRow({ label, value, mono }: { label: string; value: string; mono: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-accent-20 pb-2">
      <div className="font-caps text-[8px] tracking-[0.25em] text-text-dim uppercase shrink-0">{label}</div>
      <div
        className={`text-[13px] text-text-main text-right tracking-wider break-all ${mono ? 'font-mono' : 'font-sans'}`}
      >
        {value}
      </div>
    </div>
  );
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
