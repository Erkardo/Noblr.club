import { motion } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';
import { DOSSIER_ROSTER_THIS_WEEK } from '../../data/dossierRoster';
import { useAppContext } from '../../context/AppContext';

/**
 * The curiosity-gap engine. We show outsiders the actual shape of this
 * week's Monday Dossier — six cards, masked member numbers, role, age,
 * a single evocative sentence with key nouns blacked out. One card is
 * revealed as a tasting menu; five are blurred.
 *
 * This works because the human brain hates unfinished information.
 * Shown a redacted silhouette, you *have* to imagine who it could be —
 * and that act of imagination is the hook.
 */
export function DossierPreview({ onLogin }: { onLogin: () => void }) {
  const { applications } = useAppContext();
  // Issue number: derive something that increments reliably. ISO week.
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const issueNumber = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);

  const sealedThisWeek = applications.filter(a => a.status === 'APPROVED').length || 6;

  return (
    <section
      aria-label="This week's Monday Dossier preview"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-5 md:px-6 relative z-10 border-t border-accent-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        className="text-center mb-14 md:mb-20"
      >
        <div className="font-caps text-[9px] tracking-[0.4em] text-accent uppercase mb-5">
          The Monday Dossier · This Week
        </div>
        <h2 className="font-display text-[38px] sm:text-[48px] md:text-[64px] font-light text-text-main leading-[1.02] tracking-[-0.02em]">
          Vol. IV <span className="text-text-dim/60 font-serif italic">·</span>{' '}
          Issue {issueNumber}
        </h2>
        <p className="mt-7 font-serif italic text-[15px] text-text-dim max-w-xl mx-auto leading-[1.7]">
          Энэ долоо хоногт {sealedThisWeek} шинэ гишүүний dossier
          гишүүдэд нээгдэнэ. Хэн бэ гэдгийг зөвхөн гишүүд бүрэн харна.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-accent-20 border border-accent-20">
        {DOSSIER_ROSTER_THIS_WEEK.map((card, i) => {
          const revealed = !!card.revealed;
          return (
            <motion.div
              key={`${card.maskedNumber}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="relative bg-bg-base p-7 md:p-9 flex flex-col min-h-[260px] md:min-h-[280px] group"
            >
              <div
                className={`flex-1 flex flex-col ${
                  revealed ? '' : 'blur-[5px] select-none pointer-events-none'
                } transition-all`}
                aria-hidden={!revealed}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="font-caps text-[9px] tracking-[0.25em] text-accent uppercase">
                    {card.tag}
                  </div>
                  <div className="font-sans text-[10px] text-text-dim/60 tracking-[0.1em]">
                    {card.maskedNumber}
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-display italic text-text-main text-[22px] md:text-[24px] font-light leading-tight">
                    {card.role}
                  </h3>
                  <span className="font-sans text-[12px] text-text-dim">
                    · {card.ageRange}
                  </span>
                </div>
                <p className="font-serif italic text-[13px] md:text-[14px] text-text-dim leading-[1.7] mt-4">
                  {card.teaser}
                </p>
              </div>

              {/* Overlay for blurred cards */}
              {!revealed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-bg-base/30 via-bg-base/60 to-bg-base/80">
                  <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase">
                    Members only
                  </div>
                </div>
              )}

              {/* Corner badge on revealed card */}
              {revealed && (
                <div className="absolute top-4 right-4 font-caps text-[8px] tracking-[0.3em] text-accent/80 uppercase bg-accent/5 border border-accent/30 px-2 py-1">
                  Sample
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8"
      >
        <p className="font-serif italic text-[13px] text-text-dim/80 max-w-md text-center">
          Гишүүд даваа гараг бүрийн 08:00-д бүрэн нэр, зураг, харилцаа холбоог хүлээн авна.
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="group inline-flex items-center gap-3 border border-accent text-accent px-7 py-3.5 text-[10px] font-caps tracking-[0.25em] uppercase hover:bg-accent hover:text-bg-base transition-colors whitespace-nowrap"
        >
          <span>Гишүүнээр нэвтрэх</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
}
