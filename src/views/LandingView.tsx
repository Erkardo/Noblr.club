import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { useAppContext } from '../context/AppContext';
import { SelectionProcessModal } from './SelectionProcessModal';
import { QuarterlyDrop } from '../components/landing/QuarterlyDrop';
import { DossierPreview } from '../components/landing/DossierPreview';
import { PricingLadder } from '../components/landing/PricingLadder';
import { MemberWhispers } from '../components/landing/MemberWhispers';
import { QuarterlyBrief } from '../components/landing/QuarterlyBrief';
import { ResumeApplicationBanner } from '../components/landing/ResumeApplicationBanner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCountdown } from '../hooks/useCountdown';
import { getNextDropClose, getAcceptanceStats } from '../lib/dropWindow';
import type { ApplicationDraft } from '../types';

export function LandingView({ onApply, onAdmin }: { onApply: () => void, onAdmin?: () => void }) {
  const { setView, lastApplicationId, applications, pendingInvite } = useAppContext();
  const hasPendingApplication = lastApplicationId
    ? applications.some(a => a.id === lastApplicationId)
    : false;
  const [showProcess, setShowProcess] = useState(false);

  // Sunk-cost mechanic: a draft the visitor started and walked away from.
  // Only surface it if they haven't yet submitted (otherwise they see the
  // "My dossier status" track instead — which is the higher-priority path).
  const [draft, setDraft] = useLocalStorage<ApplicationDraft | null>('noblr:applicationDraft', null);
  const hasDraft = !!draft && !hasPendingApplication && hasAnyFormContent(draft);

  // Live drop countdown for the hero pill — compact version of the full
  // countdown that lives further down the page.
  const dropTarget = useMemo(() => getNextDropClose(), []);
  const { days, hours, minutes } = useCountdown(dropTarget);

  // Live acceptance stats — drive the footer counter and Standards section.
  const stats = useMemo(() => getAcceptanceStats(applications), [applications]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col w-full"
    >
      <NoiseOverlay position="fixed" />

      {/* Hero — Tesla register: type-led top, full-bleed image
          below, lots of negative space, sans-serif confidence. */}
      <div className="w-full flex flex-col relative z-10">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 md:pt-20 pb-12 md:pb-16 text-center">
          {pendingInvite && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="mb-10 md:mb-12 w-full max-w-[440px] mx-auto bg-bg-2 border border-accent-20 px-5 py-4 md:px-6 md:py-5 flex items-center gap-4 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-bg-base border border-accent-20 flex items-center justify-center shrink-0">
                <Lock className="w-3.5 h-3.5 text-text-main" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-caps text-[10px] tracking-[0.2em] text-text-dim uppercase mb-0.5">Sponsored invitation</div>
                <div className="text-[14px] text-text-main leading-tight">
                  By {pendingInvite.issuedByMemberNumber} · <span className="text-text-dim">{pendingInvite.issuedByName}</span>
                </div>
              </div>
            </motion.div>
          )}

          {hasDraft && draft && (
            <div className="mx-auto">
              <ResumeApplicationBanner
                draft={draft}
                onResume={onApply}
                onDiscard={() => setDraft(null)}
              />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-caps text-[11px] tracking-[0.2em] text-text-dim uppercase mb-6 md:mb-8"
          >
            {pendingInvite ? 'Sponsored Invitation Active' : 'Private Members Club · Ulaanbaatar'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px] font-display text-text-main font-light leading-[0.98] tracking-[-0.025em] mb-6 md:mb-8"
          >
            Олонхид биш. <span className="text-accent italic font-serif">Шилдгүүдэд.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.55 }}
            className="text-text-dim text-[16px] sm:text-[18px] md:text-[19px] max-w-[640px] leading-[1.55] mb-10 md:mb-14 mx-auto font-sans font-light"
          >
            Карер, боловсрол, үнэлэмжээрээ ижил түвшний хүмүүст зориулагдсан Монголын хамгийн өндөр шалгууртай танилцах клуб.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3 w-full max-w-[640px] mx-auto"
          >
            <button
              onClick={onApply}
              className="group w-full sm:w-auto sm:min-w-[280px] bg-text-main text-bg-base px-8 py-4 text-[12px] font-sans font-medium tracking-[0.05em] uppercase hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-3"
            >
              <span>Гишүүнчлэлийн хүсэлт</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              type="button"
              onClick={() => setShowProcess(true)}
              className="group w-full sm:w-auto sm:min-w-[280px] bg-transparent border border-text-main text-text-main px-8 py-4 text-[12px] font-sans font-medium tracking-[0.05em] uppercase hover:bg-text-main hover:text-bg-base transition-colors duration-300 flex items-center justify-center"
            >
              Сонгон шалгаруулах үйл явц
            </button>
          </motion.div>

          {/* Live ticker — minimalist, monospace, lots of space */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-[11px] tracking-[0.05em] text-text-dim"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Spring 2026 drop closing in
            </span>
            <span className="text-text-main font-medium tabular-nums">
              {days}d {String(hours).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m
            </span>
            <span className="text-text-dim-2">·</span>
            <span>Acceptance rate <span className="text-text-main font-medium">{stats.rate}%</span></span>
          </motion.div>

          {hasPendingApplication && (
            <motion.button
              type="button"
              onClick={() => setView('waitlist')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 font-sans text-[12px] tracking-[0.05em] text-text-main hover:text-accent transition-colors flex items-center gap-2 group mx-auto"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              View dossier status — Committee in 48–72h
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>

        {/* Full-bleed atmospheric photo — Tesla model page register.
            The image is the visual content that carries the emotion;
            the type above is the rational claim. Keep aspect tall on
            mobile so it lands just right. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-bg-2 relative"
        >
          <img
            src="https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=2400&h=1000&q=85"
            alt=""
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-base to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Quarterly Drop — URGENCY */}
      <QuarterlyDrop onApply={onApply} />

      {/* The Dimensions Section (Enigmatic) */}
      <div className="w-full max-w-5xl mx-auto py-24 px-6 relative z-10 border-t border-accent-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="font-caps text-[9px] tracking-[0.4em] text-accent uppercase mb-4">Гурван хэмжээс</div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-text-main">
            Нэг урилга. <span className="text-text-dim italic font-serif">Таны сонголт.</span>
          </h2>
          <p className="mt-6 text-[15px] font-serif text-text-dim max-w-lg mx-auto leading-relaxed">
            Олон нийтийн шуугианаас алслагдсан хаалттай хүрээлэн. Энд харилцаа бүр өөрийн гэсэн гүн утгатай. Юуны тулд нэгдэх нь зөвхөн таны нууц.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-px bg-accent-20 border border-accent-20">
          {[
            {
              tag: "The Network",
              title: "Бизнесийн хүрээлэл",
              desc: "Карер, хөрөнгө оруулалт болон масштаб",
              // Heritage interior — leather, books. No faces (anonymity).
              image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&h=675&q=80"
            },
            {
              tag: "The Circle",
              title: "Сонирхол нэгтэн",
              desc: "Оюун санаа болон үнэлэмжийн нөхөрлөл",
              // Candlelit dinner — wine glasses, intimate. Atmospheric.
              image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&h=675&q=80"
            },
            {
              tag: "The Romance",
              title: "Хувийн харилцаа",
              desc: "Утга төгөлдөр болзоо болон хайр сэтгэл",
              // Piano keys / intimate music register.
              image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&h=675&q=80"
            }
          ].map((dim, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-bg-2 flex flex-col group hover:bg-bg-3 transition-colors duration-500 overflow-hidden"
            >
              {/* Editorial photo — desaturated to integrate with cream
                  palette, slight warmth on hover for life. */}
              <div className="aspect-[4/3] overflow-hidden bg-bg-3 relative">
                <img
                  src={dim.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-bg-base/15 group-hover:bg-bg-base/0 transition-colors duration-700 mix-blend-multiply" />
              </div>
              <div className="p-8 md:p-10 flex flex-col items-center text-center">
                <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase border-b border-accent/30 pb-2 mb-5 group-hover:border-accent transition-colors">{dim.tag}</div>
                <h3 className="font-display italic text-2xl md:text-[26px] font-light text-text-main mb-3 leading-tight">{dim.title}</h3>
                <p className="font-sans text-[11px] text-text-dim uppercase tracking-[0.15em] leading-relaxed">{dim.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dossier Preview — CURIOSITY GAP */}
      <DossierPreview onLogin={() => setView('login')} />

      {/* Standards & Process Section */}
      <div className="w-full max-w-6xl mx-auto py-32 px-6 relative z-10 border-t border-accent-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* The 13% Stat */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start"
          >
            <div className="font-caps text-[9px] tracking-[0.3em] text-text-main uppercase mb-8">The Standard</div>
            <div className="font-display text-[96px] sm:text-[120px] md:text-[140px] lg:text-[180px] leading-none text-text-main font-light mb-4 tracking-tighter">
              {stats.rate}<span className="text-text-main text-[56px] sm:text-[70px] md:text-[80px] lg:text-[100px] align-top relative top-4">%</span>
            </div>
            <div className="font-caps text-[11px] tracking-[0.2em] text-text-main uppercase mb-6 mt-4">Элсэх магадлал</div>
            <p className="font-serif italic text-[16px] text-text-dim leading-[1.8] max-w-sm">
              Гишүүнчлэлийн хүсэлт илгээсэн нийт хүмүүсийн ердөө {stats.rate} хувь нь л бидний шалгуурыг давж, урилга хүлээн авдаг. Бидний хувьд тооноос илүү чанар үргэлж чухал.
            </p>
          </motion.div>

          {/* Criteria & Process */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col gap-16 lg:pt-8"
          >
            {/* Split Criteria */}
            <div className="grid grid-cols-2 gap-8 lg:gap-12 pl-6 lg:pl-10 border-l border-accent-20">
              <div>
                <div className="font-caps text-[9px] tracking-[0.2em] text-text-main uppercase mb-6 border-b border-accent-20 pb-3">Бид юу хайдаг вэ?</div>
                <ul className="space-y-4 font-serif font-light text-[14px] text-text-dim">
                  <li>&mdash; Оюуны өндөр цар хүрээ</li>
                  <li>&mdash; Тогтвортой карер, амжилт</li>
                  <li>&mdash; Эерэг үнэлэмж, хүндлэл</li>
                </ul>
              </div>
              <div>
                <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-6 border-b border-accent-20 pb-3">Юунаас татгалздаг вэ?</div>
                <ul className="space-y-4 font-serif font-light text-[14px] text-text-dim-2">
                  <li>&mdash; Өнгөц, хуурамч байдал</li>
                  <li>&mdash; Бусдыг үл хүндлэх хандлага</li>
                  <li>&mdash; Тодорхой бус зорилго</li>
                </ul>
              </div>
            </div>

            {/* Process */}
            <div className="pl-6 lg:pl-10 border-l border-accent-20">
              <div className="font-caps text-[9px] tracking-[0.2em] text-text-main uppercase mb-8">Сонгон шалгаруулах процесс</div>
              <div className="flex flex-col gap-8">
                <div className="flex gap-6 items-start">
                  <div className="font-sans text-[10px] text-text-main mt-1">01</div>
                  <div>
                    <div className="font-caps text-[11px] text-text-main uppercase tracking-[0.1em] mb-2">Анкет баталгаажилт</div>
                    <div className="font-serif italic text-[14px] text-text-dim">100% хувийн мэдээлэл болон карерын баталгаажуулалт.</div>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="font-sans text-[10px] text-text-main mt-1">02</div>
                  <div>
                    <div className="font-caps text-[11px] text-text-main uppercase tracking-[0.1em] mb-2">Хорооны үнэлгээ</div>
                    <div className="font-serif italic text-[14px] text-text-dim">Хаалттай хороо 48-72 цагт хянан хэлэлцэнэ.</div>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="font-sans text-[10px] text-text-main mt-1">03</div>
                  <div>
                    <div className="font-caps text-[11px] text-text-main uppercase tracking-[0.1em] mb-2">Эцсийн урилга</div>
                    <div className="font-serif italic text-[14px] text-text-dim">Шалгуур хангасан тусгай бүрэлдэхүүнд нэвтрэх эрх олгоно.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Pricing Ladder — ANCHORING */}
      <PricingLadder onApply={onApply} />

      {/* Member Whispers — TRIBAL BELONGING / SOCIAL PROOF */}
      <MemberWhispers />

      {/* Quarterly Brief — RECIPROCITY GIFT */}
      <QuarterlyBrief />

      {/* Philosophy Statement — dramatic dark inverse against the cream
          rhythm. A foggy steppe atmospheric photo behind the headline,
          dimmed to read as texture rather than imagery. */}
      <div className="w-full relative z-10 my-12 md:my-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-bg-ink"
          style={{
            backgroundImage: `linear-gradient(rgba(26,22,18,0.78), rgba(26,22,18,0.86)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative w-full max-w-5xl mx-auto py-32 md:py-48 px-6 text-center flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2 }}
            className="font-caps text-[10px] tracking-[0.4em] text-accent uppercase mb-8"
          >
            — Founders' Statement
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="font-display text-4xl md:text-5xl lg:text-7xl text-bg-base font-light leading-[1.1] tracking-[-0.02em]"
          >
            &ldquo;Noble isn't a profession.<br/>
            <span className="italic font-serif mt-2 block" style={{ color: '#D9B8B6' }}>It's a disposition.&rdquo;</span>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full flex flex-col md:flex-row gap-6 justify-between items-center text-[9px] uppercase tracking-[0.2em] text-text-dim border-t border-accent-20 pt-10 pb-8 px-12 font-caps mt-auto relative z-10"
      >
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Noblr Private Club &mdash; Ulaanbaatar</span>
          <button onClick={onAdmin} className="opacity-0 hover:opacity-100 px-2 py-1 bg-text-main/5 transition-opacity" title="Review Committee">SYS</button>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setView('about')} className="hover:text-text-main transition-colors">About</button>
          <button onClick={() => setView('privacy')} className="hover:text-text-main transition-colors">Privacy</button>
          <button onClick={() => setView('terms')} className="hover:text-text-main transition-colors">Terms</button>
        </div>
        <div>Pending applications: <span className="text-text-main">{Math.max(1422, 1422 + stats.pending)}</span></div>
        <div className="font-serif italic text-accent tracking-normal capitalize text-[11px]">100% Identity Verification Required</div>
      </motion.div>

      <SelectionProcessModal
        open={showProcess}
        onClose={() => setShowProcess(false)}
        onApply={onApply}
      />
    </motion.div>
  );
}

/**
 * A draft with only empty strings everywhere is effectively "nothing" —
 * we don't want the resume banner bouncing up the first time someone
 * clicks Apply and then bounces back without typing. This returns true
 * iff the visitor typed at least one meaningful character.
 */
function hasAnyFormContent(draft: ApplicationDraft): boolean {
  const f = draft.form;
  return !!(
    (f.name && f.name.trim()) ||
    (f.email && f.email.trim()) ||
    (f.phone && f.phone.trim()) ||
    (f.birthday && f.birthday.trim()) ||
    f.gender ||
    (f.instagram && f.instagram.trim()) ||
    (f.facebook && f.facebook.trim()) ||
    (f.linkedin && f.linkedin.trim()) ||
    (f.position && f.position.trim()) ||
    (f.company && f.company.trim()) ||
    f.experience ||
    (f.education && f.education.trim()) ||
    f.intent ||
    (f.motivation && f.motivation.trim()) ||
    (f.influences && f.influences.trim())
  );
}
