import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { X, Check, Lock } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { useAppContext } from '../context/AppContext';

export function SelectionProcessModal({ open, onClose, onApply }: {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
}) {
  const { applications, lastApplicationId, setView, invites } = useAppContext();

  const pending = applications.filter(a => a.status === 'PENDING');

  // Flavor offsets so the queue reads as an established society, not an empty demo.
  const displayPending = 1247 + pending.length;
  const identityVerified = displayPending;
  const backgroundCheck = 142 + pending.length;
  const committeeVote = 8;

  // Subtle live-counter flicker to convey realtime activity
  const [liveCount, setLiveCount] = useState(displayPending);
  useEffect(() => {
    if (!open) return;
    setLiveCount(displayPending);
    const id = setInterval(() => {
      setLiveCount(c => c + (Math.random() > 0.6 ? 1 : 0));
    }, 3000);
    return () => clearInterval(id);
  }, [open, displayPending]);

  const ownApp = lastApplicationId
    ? applications.find(a => a.id === lastApplicationId) ?? null
    : null;

  const [redeemInput, setRedeemInput] = useState('');
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Build a mixed list: user's own app first (if exists), then recent others.
  // Anonymize IDs other than user's own to preserve the sense of privacy.
  const recent = (() => {
    const others = applications
      .filter(a => a.id !== lastApplicationId)
      .slice(0, ownApp ? 7 : 8);
    return ownApp ? [ownApp, ...others] : others;
  })();

  const anonymize = (id: string) => id.length >= 4 ? `${id.slice(0, 2)}•••${id.slice(-1)}` : id;

  const handleCta = () => {
    if (ownApp) {
      setView('waitlist');
    } else {
      onApply();
    }
    onClose();
  };

  const handleRedeem = (e: FormEvent) => {
    e.preventDefault();
    const code = redeemInput.trim().toUpperCase();
    if (!code) return;
    const match = invites.find(inv => inv.code === code);
    if (!match) {
      setRedeemError('Код олдсонгүй. Дахин шалгаарай.');
      return;
    }
    if (match.claimedByApplicationId) {
      setRedeemError('Энэ код аль хэдийн ашиглагдсан.');
      return;
    }
    window.location.href = `${window.location.pathname}?i=${code}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-bg-base/90 backdrop-blur-xl" />

          <motion.div
            initial={{ scale: 0.96, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-xl bg-[#0A0908] border border-accent-20 p-5 md:p-10 my-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 w-9 h-9 rounded-full flex items-center justify-center text-text-dim hover:text-text-main border border-transparent hover:border-accent-20 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase mb-3">Live Queue</div>
            <h2 className="font-display text-3xl md:text-4xl font-light text-text-main leading-[1.1] tracking-tight mb-2">
              Сонгон шалгаруулалтын явц
            </h2>
            <p className="font-serif italic text-text-dim text-[13px] mb-8">
              Одоогоор хорооны үнэлгээнд хүлээгдэж буй өргөдлүүд. Шинэ өгөгдөл бодит цагт шинэчлэгдэнэ.
            </p>

            {/* Big counter */}
            <div className="text-center py-6 md:py-8 border-y border-accent-20 mb-8">
              <motion.div
                key={liveCount}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="font-display text-[64px] md:text-[100px] leading-none text-text-main font-light tracking-tighter tabular-nums"
              >
                {liveCount.toLocaleString('en-US')}
              </motion.div>
              <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase mt-3">
                pending dossiers
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 font-caps text-[8px] tracking-[0.25em] text-accent/70 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Realtime
              </div>
            </div>

            {/* 3 stages */}
            <div className="mb-8">
              <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase mb-4">
                Current stage distribution
              </div>
              <Stage label="Танилт баталгаажилт" count={identityVerified} icon={<Check className="w-3 h-3 text-accent" />} />
              <Stage label="Нууц шалгаруулалт" count={backgroundCheck} icon={<Spinner size="w-3 h-3" />} />
              <Stage label="Хорооны санал" count={committeeVote} icon={<Lock className="w-3 h-3 text-text-dim" />} />
            </div>

            {/* Recent activity */}
            <div className="mb-8">
              <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase mb-4">
                Recent activity
              </div>
              {recent.length === 0 ? (
                <div className="font-serif italic text-text-dim text-[13px] py-4">
                  Одоогоор шинэ өргөдөл хүлээгдэж байгаа газар үзэгдэхгүй.
                </div>
              ) : (
                <div className="space-y-0 font-mono text-[12px] md:text-[13px]">
                  {recent.map(app => {
                    const isOwn = app.id === lastApplicationId;
                    return (
                      <div
                        key={app.id}
                        className={`flex justify-between items-center py-3 border-b border-accent-20/40 ${isOwn ? 'text-accent' : 'text-text-dim'}`}
                      >
                        <div className="flex items-center gap-3">
                          {isOwn && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                          <span className="tracking-widest">
                            {isOwn ? app.id : anonymize(app.id)}
                          </span>
                          {isOwn && (
                            <span className="font-caps text-[8px] tracking-[0.25em] text-accent uppercase">
                              Таны өргөдөл
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] shrink-0">{app.date}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Two paths — the emotional punch */}
            <div className="mb-8">
              <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase mb-4">
                Two paths to consideration
              </div>
              <div className="grid grid-cols-2 gap-px bg-accent-20 border border-accent-20">
                <div className="bg-[#0A0908] p-4 md:p-5 flex flex-col items-center text-center opacity-70">
                  <div className="font-caps text-[8px] tracking-[0.25em] text-text-dim uppercase mb-3">
                    Walk-in
                  </div>
                  <div className="font-display text-[40px] md:text-[52px] leading-none text-text-main/80 font-light tabular-nums">
                    ~5<span className="text-[22px] md:text-[28px] align-top text-text-dim">%</span>
                  </div>
                  <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase mt-2 mb-3">
                    accept
                  </div>
                  <div className="font-serif italic text-[11px] text-text-dim leading-snug">
                    6+ сар<br />
                    <span className="text-text-dim/60">капацитигаар</span>
                  </div>
                </div>
                <div className="bg-[#0A0908] p-4 md:p-5 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  <div className="font-caps text-[8px] tracking-[0.25em] text-accent uppercase mb-3 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                    Invited
                  </div>
                  <div className="font-display text-[40px] md:text-[52px] leading-none text-text-main font-light tabular-nums">
                    ~42<span className="text-[22px] md:text-[28px] align-top text-accent">%</span>
                  </div>
                  <div className="font-caps text-[8px] tracking-[0.2em] text-accent uppercase mt-2 mb-3">
                    accept
                  </div>
                  <div className="font-serif italic text-[11px] text-text-dim leading-snug">
                    48–72 цаг<br />
                    <span className="text-text-dim/60">priority pass</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invite bridge */}
            <div className="mb-8">
              <p className="text-center font-serif italic text-[14px] md:text-[15px] text-text-main mb-2">
                Та Noblr-ийн гишүүнтэй танил юу?
              </p>
              <p className="text-center font-sans text-[10px] text-text-dim tracking-[0.1em] mb-5">
                Гишүүн бүрд <span className="text-accent">3 урилга</span> байдаг.
              </p>
              <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row items-stretch justify-center gap-2 max-w-sm mx-auto">
                <input
                  value={redeemInput}
                  onChange={(e) => { setRedeemInput(e.target.value.toUpperCase()); setRedeemError(null); }}
                  placeholder="NBLR-I-XXXXX"
                  className="flex-1 font-mono text-[12px] tracking-[0.15em] text-center py-2.5 border-b border-accent-20 focus:border-accent outline-none bg-transparent placeholder:text-text-dim/30"
                />
                <button
                  type="submit"
                  disabled={!redeemInput.trim()}
                  className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase border border-accent/40 px-5 py-2.5 hover:bg-accent hover:text-bg-base transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-accent"
                >
                  Код оруулах
                </button>
              </form>
              {redeemError && (
                <div className="mt-3 text-center font-sans text-[10px] text-[#FF4A4A]">{redeemError}</div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleCta}
              className="w-full bg-accent text-bg-base py-4 font-caps text-[11px] tracking-[0.2em] uppercase hover:bg-white transition-colors"
            >
              {ownApp ? 'Миний статус харах' : 'Өргөдөл илгээх'}
            </button>

            <p className="text-center font-sans text-[10px] text-text-dim/60 mt-4 leading-relaxed">
              Таны өргөдлийн ID зөвхөн танд бүрэн харагдана. Бусад өгөгдөл дурамжлагдсан.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stage({ label, count, icon }: { label: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-accent-20/40">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-sans text-[13px] text-text-main/80">{label}</span>
      </div>
      <span className="font-mono text-[14px] text-text-main tracking-widest tabular-nums">{count.toLocaleString('en-US')}</span>
    </div>
  );
}
