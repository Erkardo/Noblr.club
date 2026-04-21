import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { PRESS_DATA } from '../data/press';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { useAppContext } from '../context/AppContext';
import { SelectionProcessModal } from './SelectionProcessModal';

export function LandingView({ onApply, onAdmin }: { onApply: () => void, onAdmin?: () => void }) {
  const { setView, lastApplicationId, applications, pendingInvite } = useAppContext();
  const hasPendingApplication = lastApplicationId
    ? applications.some(a => a.id === lastApplicationId)
    : false;
  const [showProcess, setShowProcess] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col w-full"
    >
      <NoiseOverlay position="fixed" />

      {/* Hero Section */}
      <div className="w-full flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-6 min-h-[85vh] relative z-10 pt-10 pb-20">
        <div className="max-w-4xl flex flex-col items-center w-full">
          {pendingInvite && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="mb-10 md:mb-12 w-full max-w-[420px] bg-accent/5 border border-accent/40 px-5 py-4 md:px-6 md:py-5 flex items-center gap-4"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-accent/50 flex items-center justify-center shrink-0">
                <Lock className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase mb-1">Sponsored invitation</div>
                <div className="font-display text-[15px] md:text-[16px] text-text-main leading-tight">
                  <span className="font-sans text-text-dim text-[10px] tracking-[0.2em] uppercase mr-2">By</span>
                  {pendingInvite.issuedByMemberNumber} · <span className="italic text-text-dim">{pendingInvite.issuedByName}</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="inline-block border border-accent text-accent px-5 py-2.5 text-[9px] tracking-[0.3em] uppercase mb-10 md:mb-12 font-caps"
          >
            {pendingInvite ? 'Таныг Уриагаар Хүлээж Байна' : 'Хаалттай Нийгэмлэг'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="text-[40px] sm:text-5xl md:text-6xl lg:text-[80px] font-display text-text-main font-light leading-[1.05] tracking-[-0.02em] mb-6 md:mb-8"
          >
            Олонхид биш. <br/>
            <span className="text-text-dim italic font-serif">Шилдгүүдэд.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="text-text-dim text-[15px] sm:text-[17px] md:text-[18px] max-w-[500px] leading-[1.6] mb-10 md:mb-14 mx-auto font-serif font-light"
          >
            Карер, боловсрол, үнэлэмжээрээ ижил түвшний хүмүүст зориулагдсан Монголын хамгийн өндөр шалгууртай танилцах клуб. Бид хүн бүрт нээлттэй биш.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 w-full sm:w-auto"
          >
            <button
              onClick={onApply}
              className="group relative bg-accent text-bg-base px-8 sm:px-10 py-4 sm:py-5 text-[10px] sm:text-[11px] font-caps tracking-[0.2em] uppercase overflow-hidden hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <span>Гишүүнчлэлийн хүсэлт илгээх</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setShowProcess(true)}
              className="text-text-main text-[10px] tracking-[0.15em] uppercase border-b border-accent/20 pb-1 hover:border-accent hover:text-accent transition-all duration-300 font-caps"
            >
              Сонгон шалгаруулах үйл явц
            </button>
          </motion.div>

          {hasPendingApplication && (
            <motion.button
              type="button"
              onClick={() => setView('waitlist')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-10 font-caps text-[10px] tracking-[0.25em] text-accent/80 uppercase hover:text-accent transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Миний dossier статус
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>

      {/* The Dimensions Section (Enigmatic) */}
      <div className="w-full max-w-5xl mx-auto py-24 px-6 relative z-10">
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
            { tag: "The Network", title: "Бизнесийн хүрээлэл", desc: "Карер, хөрөнгө оруулалт болон масштаб" },
            { tag: "The Circle", title: "Сонирхол нэгтэн", desc: "Оюун санаа болон үнэлэмжийн нөхөрлөл" },
            { tag: "The Romance", title: "Хувийн харилцаа", desc: "Утга төгөлдөр болзоо болон хайр сэтгэл" }
          ].map((dim, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-bg-base p-10 flex flex-col items-center text-center group hover:bg-[#0E0C0A] transition-colors duration-500"
            >
              <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase border-b border-accent/20 pb-2 mb-6 group-hover:border-accent transition-colors">{dim.tag}</div>
              <h3 className="font-serif italic text-xl text-text-main mb-3">{dim.title}</h3>
              <p className="font-sans text-[11px] text-text-dim uppercase tracking-[0.1em]">{dim.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

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
            <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase mb-8">The Standard</div>
            <div className="font-display text-[96px] sm:text-[120px] md:text-[140px] lg:text-[180px] leading-none text-text-main font-light mb-4 tracking-tighter">
              13<span className="text-accent text-[56px] sm:text-[70px] md:text-[80px] lg:text-[100px] align-top relative top-4">%</span>
            </div>
            <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-6 mt-4">Элсэх магадлал</div>
            <p className="font-serif italic text-[16px] text-text-dim leading-[1.8] max-w-sm">
              Гишүүнчлэлийн хүсэлт илгээсэн нийт хүмүүсийн ердөө дунджаар 13 хувь нь л бидний шалгуурыг давж, урилга хүлээн авдаг. Бидний хувьд тооноос илүү чанар үргэлж чухал.
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
                <div className="font-caps text-[9px] tracking-[0.2em] text-white uppercase mb-6 border-b border-accent-20 pb-3">Бид юу хайдаг вэ?</div>
                <ul className="space-y-4 font-serif font-light text-[14px] text-text-dim">
                  <li>&mdash; Оюуны өндөр цар хүрээ</li>
                  <li>&mdash; Тогтвортой карер, амжилт</li>
                  <li>&mdash; Эерэг үнэлэмж, хүндлэл</li>
                </ul>
              </div>
              <div>
                <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-6 border-b border-accent-20 pb-3">Юунаас татгалздаг вэ?</div>
                <ul className="space-y-4 font-serif font-light text-[14px] text-text-dim/40">
                  <li>&mdash; Өнгөц, хуурамч байдал</li>
                  <li>&mdash; Бусдыг үл хүндлэх хандлага</li>
                  <li>&mdash; Тодорхой бус зорилго</li>
                </ul>
              </div>
            </div>

            {/* Process */}
            <div className="pl-6 lg:pl-10 border-l border-accent-20">
              <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase mb-8">Сонгон шалгаруулах процесс</div>
              <div className="flex flex-col gap-8">
                <div className="flex gap-6 items-start">
                  <div className="font-sans text-[10px] text-accent mt-1">01</div>
                  <div>
                    <div className="font-caps text-[11px] text-white uppercase tracking-[0.1em] mb-2">Анкет баталгаажилт</div>
                    <div className="font-serif italic text-[14px] text-text-dim">100% хувийн мэдээлэл болон карерын баталгаажуулалт.</div>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="font-sans text-[10px] text-accent mt-1">02</div>
                  <div>
                    <div className="font-caps text-[11px] text-white uppercase tracking-[0.1em] mb-2">Хорооны үнэлгээ</div>
                    <div className="font-serif italic text-[14px] text-text-dim">Хаалттай хороо 48-72 цагт хянан хэлэлцэнэ.</div>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="font-sans text-[10px] text-accent mt-1">03</div>
                  <div>
                    <div className="font-caps text-[11px] text-white uppercase tracking-[0.1em] mb-2">Эцсийн урилга</div>
                    <div className="font-serif italic text-[14px] text-text-dim">Шалгуур хангасан тусгай бүрэлдэхүүнд нэвтрэх эрх олгоно.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Press Section */}
      <div className="w-full max-w-6xl mx-auto py-32 px-6 relative z-10 border-t border-accent-20">
        <h3 className="font-caps tracking-[0.3em] text-[10px] text-text-dim text-center uppercase mb-16">
          In The Press
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-px bg-accent-20 border border-accent-20 rounded-sm">
          {PRESS_DATA.map((press, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden group bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center cursor-default">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40 z-10 transition-opacity duration-700 group-hover:opacity-90" />
              <img src={press.image} alt={press.logo} className="absolute inset-0 w-full h-full object-cover filter grayscale-[60%] brightness-75 group-hover:scale-105 transition-transform duration-1000 opacity-60" />

              <div className="relative z-20 flex flex-col items-center gap-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className={`${press.font} text-white opacity-90 drop-shadow-2xl`}>{press.logo}</div>
                <p className="font-serif italic text-[15px] leading-relaxed text-white/90 font-light max-w-xs drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {press.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Statement */}
      <div className="w-full max-w-5xl mx-auto py-32 md:py-48 px-6 relative z-10 text-center flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          className="font-display text-4xl md:text-5xl lg:text-7xl text-text-main font-light leading-[1.1] tracking-[-0.02em]"
        >
          "Noble isn't a profession.<br/>
          <span className="text-accent italic font-serif mt-2 block">It's a disposition.</span>"
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full flex flex-col md:flex-row gap-6 justify-between items-center text-[9px] uppercase tracking-[0.2em] text-text-dim border-t border-accent-20 pt-10 pb-8 px-12 font-caps mt-auto relative z-10"
      >
        <div className="flex items-center gap-2">
          <span>&copy; 2024 Noblr Private Club &mdash; Ulaanbaatar</span>
          <button onClick={onAdmin} className="opacity-0 hover:opacity-100 px-2 py-1 bg-white/5 transition-opacity" title="Review Committee">SYS</button>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setView('privacy')} className="hover:text-text-main transition-colors">Privacy</button>
          <button onClick={() => setView('terms')} className="hover:text-text-main transition-colors">Terms</button>
        </div>
        <div>Pending applications: <span className="text-white">1,422</span></div>
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
