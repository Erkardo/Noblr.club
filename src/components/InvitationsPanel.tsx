import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, Share2, Sparkles, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Invite, InviteOutcome } from '../types';

const INVITE_BASE_QUOTA = 3;
const INVITE_LIFETIME_CAP = 5;
const PATRON_THRESHOLD = 3;
const INVITE_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // skip 0/O/1/I
function generateInviteCode(): string {
  let body = '';
  for (let i = 0; i < 5; i++) body += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return `NBLR-I-${body}`;
}

function inviteLink(code: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://noblr.club';
  return `${base}/?i=${code}`;
}

const outcomeLabel: Record<InviteOutcome, string> = {
  PENDING: 'Хүлээгдэж буй',
  ACCEPTED: 'Хүлээн зөвшөөрсөн',
  REJECTED: 'Татгалзсан',
};

export function InvitationsPanel() {
  const { invites, setInvites, currentMember, setCurrentMember } = useAppContext();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [freshCode, setFreshCode] = useState<string | null>(null);

  const myInvites = useMemo(
    () => invites.filter(i => i.issuedByMemberId === currentMember.id).sort((a, b) => b.issuedAt - a.issuedAt),
    [invites, currentMember.id]
  );

  const acceptedCount = myInvites.filter(i => i.outcome === 'ACCEPTED').length;
  const isPatron = !!currentMember.patronSince || acceptedCount >= PATRON_THRESHOLD;
  const remaining = currentMember.invitesRemaining;
  const lifetimeUsed = currentMember.invitesEverIssued;
  const canIssue = remaining > 0 && lifetimeUsed < INVITE_LIFETIME_CAP;

  const handleGenerate = () => {
    if (!canIssue) return;
    const code = generateInviteCode();
    const now = Date.now();
    const newInvite: Invite = {
      code,
      issuedByMemberId: currentMember.id,
      issuedByName: currentMember.name,
      issuedByMemberNumber: currentMember.memberNumber,
      issuedAt: now,
      expiresAt: now + INVITE_LIFETIME_MS,
      claimedByApplicationId: null,
      claimedAt: null,
      outcome: 'PENDING',
    };
    setInvites(prev => [newInvite, ...prev]);
    setCurrentMember(prev => ({
      ...prev,
      invitesRemaining: Math.max(0, prev.invitesRemaining - 1),
      invitesEverIssued: prev.invitesEverIssued + 1,
    }));
    setFreshCode(code);
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(inviteLink(code));
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2200);
    } catch {
      // ignore
    }
  };

  const handleShare = async (code: string) => {
    const link = inviteLink(code);
    const text = `Noblr-д таныг урьж байна.\n\n${link}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Noblr invitation', text, url: link });
        return;
      } catch {
        // fall through
      }
    }
    handleCopy(code);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-display text-2xl font-light text-text-main">Invitations</h4>
            {isPatron && (
              <span className="font-caps text-[9px] tracking-[0.25em] text-accent uppercase border border-accent/50 px-2 py-0.5 flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5" /> Patron
              </span>
            )}
          </div>
          <p className="font-serif text-[14px] text-text-dim italic max-w-md">
            Гишүүн бүрд {INVITE_BASE_QUOTA} урилга. Амжилттай таньсан гишүүн бүрд 1 урилга эргэн сэргэнэ (насан туршдаа {INVITE_LIFETIME_CAP} хязгаартай).
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-[42px] md:text-[56px] leading-none text-text-main font-light tabular-nums">{remaining}</div>
          <div className="font-caps text-[9px] tracking-[0.25em] text-text-dim uppercase mt-1">remaining</div>
        </div>
      </div>

      {/* Patron rewards reveal */}
      {isPatron && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 border border-accent/40 bg-gradient-to-b from-accent/10 to-transparent p-5 md:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase">Patron Rewards Unlocked</span>
          </div>
          <div className="space-y-3">
            <Reward
              title="Founders' Dinner"
              desc="Жилд нэг удаа, дээд 12 Патрон founder-тай шөнийн зоогт хамтрах эрх."
            />
            <Reward
              title="Priority Rotation"
              desc="Таны Dossier шинэ гишүүдэд эхний 72 цагт харагдана."
            />
            <Reward
              title="Extended Invite Quota"
              desc={`Хэвлэгдсэн хязгаар ${INVITE_LIFETIME_CAP}-д хүрэх эрх. Амжилттай урилга бүр тогтворжно.`}
            />
          </div>
          {currentMember.patronSince && (
            <div className="mt-5 pt-4 border-t border-accent/20 font-caps text-[9px] tracking-[0.25em] text-accent/70 uppercase">
              Patron since {new Date(currentMember.patronSince).toLocaleDateString('mn-MN', { year: 'numeric', month: 'short' })}
            </div>
          )}
        </motion.div>
      )}

      {/* Quota bar */}
      <div className="flex gap-[3px] mb-8">
        {[...Array(INVITE_LIFETIME_CAP)].map((_, i) => {
          const issued = i < lifetimeUsed;
          const canReachYet = i < remaining + lifetimeUsed;
          return (
            <div
              key={i}
              className={`h-[3px] flex-1 transition-colors duration-500 ${issued ? 'bg-accent/60' : canReachYet ? 'bg-accent-20' : 'bg-accent-20/30'}`}
              title={issued ? 'issued' : canReachYet ? 'available' : 'locked'}
            />
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={handleGenerate}
          disabled={!canIssue}
          className="flex-1 bg-accent text-bg-base py-4 px-6 font-caps text-[11px] tracking-[0.2em] uppercase hover:bg-accent-deep transition-colors flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent"
        >
          <Sparkles className="w-3 h-3" />
          Generate Invitation
        </button>
        <div className="flex-1 border border-accent-20 bg-bg-2/60 p-4 font-sans text-[12px] text-text-dim leading-relaxed">
          <span className="font-caps text-[9px] tracking-[0.25em] text-accent uppercase block mb-1">Patron дэвших</span>
          Амжилттай {PATRON_THRESHOLD} удаа → Патрон статус, жил бүрийн Founders' Dinner эрх.
          <span className="block font-sans text-[11px] text-text-main/70 mt-2">
            Progress: {Math.min(acceptedCount, PATRON_THRESHOLD)} / {PATRON_THRESHOLD}
          </span>
        </div>
      </div>

      {/* Fresh code reveal */}
      <AnimatePresence>
        {freshCode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-8 border border-accent bg-accent/5 p-5 md:p-6 relative"
          >
            <button
              onClick={() => setFreshCode(null)}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-text-dim hover:text-text-main"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase mb-3">New invitation minted</div>
            <div className="font-mono text-[15px] md:text-[17px] text-text-main tracking-widest break-all mb-4">{inviteLink(freshCode)}</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleCopy(freshCode)}
                className="flex-1 border border-accent-20 bg-bg-2/70 text-text-main py-3 px-5 font-caps text-[10px] tracking-[0.2em] uppercase hover:border-accent transition-colors flex items-center justify-center gap-2"
              >
                {copiedCode === freshCode ? <><Check className="w-3 h-3 text-accent" /> Copied</> : <><Copy className="w-3 h-3" /> Copy link</>}
              </button>
              <button
                onClick={() => handleShare(freshCode)}
                className="flex-1 bg-text-main text-bg-base py-3 px-5 font-caps text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3 h-3" />
                Share
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issued list */}
      {myInvites.length > 0 && (
        <div>
          <div className="font-caps text-[9px] tracking-[0.25em] text-text-dim uppercase mb-4 flex items-center gap-3">
            Issued invitations
            <div className="flex-1 h-px bg-accent-20" />
          </div>
          <div className="space-y-0">
            {myInvites.map(inv => {
              const outcomeColor =
                inv.outcome === 'ACCEPTED' ? 'text-accent' :
                inv.outcome === 'REJECTED' ? 'text-error' :
                'text-text-dim';
              const now = Date.now();
              const expiresAt = inv.expiresAt ?? (inv.issuedAt + INVITE_LIFETIME_MS);
              const daysLeft = Math.max(0, Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000)));
              const isExpired = inv.outcome === 'PENDING' && !inv.claimedByApplicationId && now > expiresAt;
              const expiryLabel = inv.outcome !== 'PENDING' || inv.claimedByApplicationId
                ? null
                : isExpired
                  ? 'хугацаа дууссан'
                  : daysLeft <= 3
                    ? `${daysLeft} хоног үлдсэн`
                    : `${daysLeft} хоногийн дараа хугацаа дуусна`;
              return (
                <div key={inv.code} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-4 border-b border-accent-20/40 ${isExpired ? 'opacity-60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[13px] text-text-main tracking-widest break-all">{inv.code}</div>
                    <div className="font-sans text-[10px] text-text-dim/70 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{new Date(inv.issuedAt).toLocaleDateString('mn-MN')}</span>
                      {expiryLabel && (
                        <span className={`${isExpired ? 'text-error/80' : daysLeft <= 3 ? 'text-accent/80' : 'text-text-dim/60'}`}>
                          · {expiryLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-caps text-[9px] tracking-[0.2em] uppercase ${isExpired ? 'text-error/70' : outcomeColor}`}>
                      {isExpired ? 'Expired' : outcomeLabel[inv.outcome]}
                    </span>
                    <button
                      onClick={() => handleCopy(inv.code)}
                      disabled={isExpired}
                      className="text-[10px] font-caps tracking-[0.2em] text-text-dim hover:text-accent uppercase transition-colors px-3 py-1.5 border border-accent-20 hover:border-accent flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-text-dim disabled:hover:border-accent-20"
                    >
                      {copiedCode === inv.code ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Reward({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="w-3 h-3 text-accent mt-1 shrink-0" />
      <div className="flex-1">
        <div className="font-caps text-[10px] tracking-[0.2em] text-text-main uppercase mb-0.5">{title}</div>
        <div className="font-serif italic text-[12px] text-text-dim leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
