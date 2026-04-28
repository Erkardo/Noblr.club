import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import {
  getNextDropClose,
  getDropName,
  getFollowingDropOpen,
} from '../../lib/dropWindow';
import { useAppContext } from '../../context/AppContext';
import { getAcceptanceStats } from '../../lib/dropWindow';

/**
 * The urgency engine. A countdown to the next quarterly close anchors
 * the "apply when you feel ready" mindset to a hard deadline. The next
 * reopening date is displayed underneath so a visitor can *see* how
 * long the wait is if they miss this window.
 *
 * We also pull live counters (applications seen, sealed dossiers,
 * acceptance rate) so the numbers look like a real roster — not a
 * hardcoded brochure.
 */
export function QuarterlyDrop({ onApply }: { onApply: () => void }) {
  const { applications } = useAppContext();
  const target = useMemo(() => getNextDropClose(), []);
  const dropName = useMemo(() => getDropName(target), [target]);
  const nextOpen = useMemo(() => getFollowingDropOpen(target), [target]);
  const nextOpenLabel = useMemo(() => getDropName(getNextDropClose(nextOpen)), [nextOpen]);
  const { days, hours, minutes, seconds } = useCountdown(target);

  const stats = useMemo(() => getAcceptanceStats(applications), [applications]);
  const sealedCount = stats.approved + stats.pending;

  const cells: Array<{ value: number; label: string }> = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Min' },
    { value: seconds, label: 'Sec' },
  ];

  return (
    <section
      aria-label="Quarterly drop countdown"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-5 md:px-6 relative z-10 border-t border-accent-20"
    >
      {/* Ticker strip — small, dense, concrete */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        className="mb-12 md:mb-16 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center font-caps text-[10px] md:text-[11px] tracking-[0.25em] text-text-main/75 uppercase"
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-text-main">{dropName}</span> · Drop Open
        </span>
        <span className="text-text-dim/50">·</span>
        <span><span className="text-text-main">{stats.total.toLocaleString()}</span> Applications</span>
        <span className="text-text-dim/50">·</span>
        <span><span className="text-text-main">{sealedCount}</span> Sealed Dossiers</span>
        <span className="text-text-dim/50">·</span>
        <span>Acceptance <span className="text-accent font-medium">{stats.rate}%</span></span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left — label + copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          className="lg:col-span-5"
        >
          <div className="font-caps text-[9px] tracking-[0.4em] text-accent uppercase mb-5">
            Хугацаат цонх
          </div>
          <h2 className="font-display text-[44px] sm:text-[56px] md:text-[68px] font-light text-text-main leading-[0.98] tracking-[-0.02em] mb-6">
            Хаалга<br/>
            <span className="text-text-dim italic font-serif">удахгүй хаагдана.</span>
          </h2>
          <p className="font-serif italic text-text-dim text-[15px] md:text-[16px] leading-[1.7] max-w-md mb-10">
            Noblr гурван сар тутамд ердөө нэг удаа өргөдөл хүлээн авна.
            Хугацаандаа илгээгээгүй dossier автоматаар хаагдах бөгөөд
            дараагийн боломж {nextOpenLabel}-д нээгдэнэ.
          </p>
          <button
            onClick={onApply}
            className="group inline-flex items-center gap-3 bg-accent text-bg-base px-8 py-4 text-[10px] font-caps tracking-[0.25em] uppercase hover:bg-accent-deep transition-colors"
          >
            <span>Одоо өргөдөл илгээх</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="mt-5 font-caps text-[10px] tracking-[0.3em] text-text-main/65 uppercase">
            ~3 минут · ₮50,000 шалгаруулалтын хураамж
          </div>
        </motion.div>

        {/* Right — countdown cells */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.15 }}
          className="lg:col-span-7"
        >
          <div className="grid grid-cols-4 gap-px bg-accent-20 border border-accent-20">
            {cells.map((cell, i) => (
              <div
                key={cell.label}
                className="bg-bg-base flex flex-col items-center justify-center py-8 md:py-12 px-2 relative"
              >
                <div
                  className={`font-display font-light text-text-main tabular-nums leading-none tracking-[-0.03em] text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] ${
                    i === 3 ? 'text-accent' : ''
                  }`}
                >
                  {String(cell.value).padStart(2, '0')}
                </div>
                <div className="mt-4 md:mt-6 font-caps text-[9px] md:text-[10px] tracking-[0.3em] text-text-main/70 uppercase">
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between font-caps text-[10px] md:text-[11px] tracking-[0.25em] text-text-main/70 uppercase">
            <span>Ulaanbaatar · UTC+8</span>
            <span>
              Closes{' '}
              <span className="text-text-main">
                {target.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
