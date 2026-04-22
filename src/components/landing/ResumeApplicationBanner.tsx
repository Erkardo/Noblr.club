import { motion } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import type { ApplicationDraft } from '../../types';

/**
 * The sunk-cost engine. A visitor who started the application and
 * walked away has already invested cognitive effort. Reminding them
 * of that progress — and showing a "last touched" timestamp — tilts
 * them back toward finishing. The elapsed-time display implies
 * urgency ("this is decaying") without explicit threats.
 */
export function ResumeApplicationBanner({
  draft,
  onResume,
  onDiscard,
}: {
  draft: ApplicationDraft;
  onResume: () => void;
  onDiscard: () => void;
}) {
  const percent = Math.round((draft.step - 1) / 4 * 100) + 12; // visual bias, feels further along
  const capped = Math.min(96, Math.max(18, percent));
  const hoursAgo = Math.max(1, Math.round((Date.now() - draft.updatedAt) / (1000 * 60 * 60)));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
      className="mb-10 md:mb-12 w-full max-w-[520px] border border-accent/40 bg-gradient-to-r from-accent/[0.08] via-accent/[0.03] to-transparent px-5 py-5 md:px-6 md:py-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-accent/50 flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase mb-1">
            Хагас дууссан dossier
          </div>
          <div className="font-display text-[16px] md:text-[17px] text-text-main leading-tight">
            Та {romanize(draft.step)} / IV алхамд үлдсэн байна
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-[2px] bg-accent-20 overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${capped}%` }}
              />
            </div>
            <span className="font-caps text-[9px] tracking-[0.25em] text-text-dim uppercase">
              {capped}%
            </span>
          </div>
          <div className="mt-2 font-serif italic text-[12px] text-text-dim leading-relaxed">
            Сүүлд нээсэн · {hoursAgo} {hoursAgo === 1 ? 'цагийн' : 'цагийн'} өмнө.
            Drop хаагдахаас өмнө дуусгана уу.
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 pl-14">
        <button
          onClick={onResume}
          className="group inline-flex items-center gap-3 bg-accent text-bg-base px-6 py-3 text-[10px] font-caps tracking-[0.25em] uppercase hover:bg-white transition-colors"
        >
          <span>Үргэлжлүүлэх</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={onDiscard}
          className="font-caps text-[9px] tracking-[0.25em] text-text-dim/70 hover:text-text-main uppercase transition-colors"
        >
          Устгах
        </button>
      </div>
    </motion.div>
  );
}

function romanize(n: number): string {
  const map = ['', 'I', 'II', 'III', 'IV'];
  return map[n] || String(n);
}
