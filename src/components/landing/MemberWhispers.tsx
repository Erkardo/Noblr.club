import { motion } from 'motion/react';
import { MEMBER_WHISPERS } from '../../data/whispers';

/**
 * Social proof, but in the quiet register. A visitor who is imagining
 * themselves as a Noblr member needs to hear people like them describe
 * the experience in specific, unadorned language — not marketing
 * superlatives. Each whisper is a short mental rehearsal of belonging.
 */
export function MemberWhispers() {
  return (
    <section
      aria-label="Member whispers"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-5 md:px-6 relative z-10 border-t border-accent-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        className="text-center mb-14 md:mb-20"
      >
        <div className="font-caps text-[9px] tracking-[0.4em] text-sage uppercase mb-5">
          Гишүүдийн чимээ
        </div>
        <h2 className="font-display text-[38px] sm:text-[48px] md:text-[60px] font-light text-text-main leading-[1.02] tracking-[-0.02em]">
          Дотроос нь.
        </h2>
        <p className="mt-6 font-serif italic text-[15px] text-text-dim max-w-xl mx-auto leading-[1.7]">
          Нэр нь нуугдсан. Дугаар нь бүрэн биш. Үнэн нь тэр хэвээрээ.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-accent-20 border border-accent-20">
        {MEMBER_WHISPERS.map((whisper, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="bg-bg-base p-8 md:p-10 flex flex-col gap-5 group hover:bg-bg-2 transition-colors duration-500"
          >
            <div className="font-display italic text-sage text-[48px] leading-none font-light -mb-4">
              &ldquo;
            </div>
            <blockquote className="font-serif italic text-text-main text-[16px] md:text-[17px] leading-[1.7] font-light">
              {whisper.quote}
            </blockquote>
            <figcaption className="mt-auto pt-4 border-t border-accent-20 flex items-center justify-between font-caps text-[9px] tracking-[0.25em] text-text-dim uppercase">
              <span className="text-text-main/80">{whisper.attribution}</span>
              <span className="text-text-dim/60">Гишүүн · {whisper.sinceYear}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
