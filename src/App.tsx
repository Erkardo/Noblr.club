import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, Check, ChevronRight, Briefcase, GraduationCap, X, Compass, Calendar, Inbox, User } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'apply' | 'waitlist' | 'login' | 'portal' | 'admin'>('landing');

  // Simple smooth scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-bg-base font-sans text-text-main relative overflow-hidden flex flex-col p-[20px]">
      <div className="absolute inset-[20px] pointer-events-none border border-accent-20 z-0" />
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-20 opacity-20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navbar Minimal */}
      <header className="relative z-20 w-full px-8 py-10 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-4">
          <div className="text-text-main font-display text-[22px] tracking-[-0.005em] font-light leading-none pt-1">Noblr</div>
        </div>
        {view === 'landing' && (
          <nav className="flex gap-8 items-center">
            <button 
              onClick={() => setView('login')}
              className="font-caps text-[11px] tracking-[0.2em] text-text-dim hover:text-text-main transition-colors uppercase"
            >
              Member Login
            </button>
          </nav>
        )}
        {(view === 'apply' || view === 'waitlist' || view === 'login' || view === 'admin') && (
          <button 
            onClick={() => setView('landing')}
            className="text-text-dim hover:text-text-main transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        {view === 'portal' && (
          <button 
            onClick={() => setView('landing')}
            className="font-caps text-[10px] tracking-[0.2em] text-text-dim hover:text-text-main transition-colors uppercase border-b border-accent-20 pb-0.5"
          >
            Log Out
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col relative z-10 isolate overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence mode="wait">
          {view === 'landing' && <LandingView key="landing" onApply={() => setView('apply')} onAdmin={() => setView('admin')} />}
          {view === 'apply' && <ApplicationView key="apply" onComplete={() => setView('waitlist')} />}
          {view === 'waitlist' && <WaitlistView key="waitlist" />}
          {view === 'login' && <LoginView key="login" onLogin={() => setView('portal')} />}
          {view === 'portal' && <PortalView key="portal" />}
          {view === 'admin' && <AdminView key="admin" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- LANDING VIEW ---
function LandingView({ onApply, onAdmin }: { onApply: () => void, onAdmin?: () => void }) {
  const PRESS_DATA = [
    {
      logo: "FORBES",
      quote: `"Монголын хамгийн нууцлаг бөгөөд өндөр шалгууртай танилцах хаалттай нийгэмлэг."`,
      image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800",
      font: "font-sans font-bold tracking-[0.2em] text-2xl uppercase"
    },
    {
      logo: "VOGUE",
      quote: `"Зөвхөн амжилт, үнэлэмжээрээ ижил түвшний хүмүүст олгогдох онцгой тасалбар."`,
      image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=800",
      font: "font-display text-[40px] tracking-tight leading-none uppercase"
    },
    {
      logo: "THE NEW YORK TIMES",
      quote: `"Уламжлалт апп-уудын эсрэг гарч ирсэн жинхэнэ 'Private' экосистем."`,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      font: "font-serif italic font-black tracking-tight text-3xl"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col w-full"
    >
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      {/* Hero Section */}
      <div className="w-full flex-1 flex flex-col items-center justify-center text-center px-6 min-h-[85vh] relative z-10 pt-10 pb-20">
        <div className="max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="inline-block border border-accent text-accent px-5 py-2.5 text-[9px] tracking-[0.3em] uppercase mb-12 font-caps"
          >
            Хаалттай Нийгэмлэг
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="text-6xl md:text-[80px] font-display text-text-main font-light leading-[1.05] tracking-[-0.02em] mb-8"
          >
            Олонхид биш. <br/>
            <span className="text-text-dim italic font-serif">Шилдгүүдэд.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="text-text-dim text-[18px] max-w-[500px] leading-[1.6] mb-14 mx-auto font-serif font-light"
          >
            Карер, боловсрол, үнэлэмжээрээ ижил түвшний хүмүүст зориулагдсан Монголын хамгийн өндөр шалгууртай танилцах клуб. Бид хүн бүрт нээлттэй биш.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="flex items-center justify-center gap-8"
          >
            <button
              onClick={onApply}
              className="group relative bg-accent text-bg-base px-10 py-5 text-[11px] font-caps tracking-[0.2em] uppercase overflow-hidden hover:bg-white transition-all duration-500 flex items-center gap-4"
            >
              <span>Гишүүнчлэлийн хүсэлт илгээх</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button 
              type="button" 
              className="text-text-main text-[10px] tracking-[0.15em] uppercase border-b border-accent/20 pb-1 hover:border-accent hover:text-accent transition-all duration-300 font-caps"
            >
              Сонгон шалгаруулах үйл явц
            </button>
          </motion.div>
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
            <div className="font-display text-[140px] md:text-[180px] leading-none text-text-main font-light mb-4 tracking-tighter">
              13<span className="text-accent text-[80px] md:text-[100px] align-top relative top-4">%</span>
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
        <div>Pending applications: <span className="text-white">1,422</span></div>
        <div className="font-serif italic text-accent tracking-normal capitalize text-[11px]">100% Identity Verification Required</div>
      </motion.div>
    </motion.div>
  );
}

// --- APPLICATION VIEW ---
function ApplicationView({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalSteps = 3;

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onComplete();
      }, 3500); // Simulate encryption and submission delay
    }
  };

  if (isProcessing) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-6 relative w-full h-full"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        <div className="w-[300px] h-[1px] bg-accent-20 overflow-hidden mb-12 relative">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-1/2 h-full bg-accent absolute top-0 left-0"
          />
        </div>
        
        <div className="flex flex-col gap-4 font-caps text-[10px] text-accent/60 uppercase tracking-[0.3em] items-center">
          <div className="w-4 h-4 rounded-full border border-accent border-t-transparent animate-spin mb-4" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Generating Identity Hash...</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>Validating Coordinates...</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>Dispatching to Review Committee...</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>Sealing Dossier...</motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="flex-1 flex flex-col justify-center px-8 py-16 w-full max-w-6xl mx-auto"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start relative z-10 w-full">
        {/* Left Column: Progress & Info */}
        <div className="md:col-span-5 flex flex-col md:sticky md:top-32">
          <div className="flex gap-2 mb-10">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className={`h-[1px] flex-1 transition-colors duration-700 ${
                  i + 1 <= step ? 'bg-accent' : 'bg-accent-20'
                }`} 
              />
            ))}
          </div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-caps text-text-dim mb-4">Chapter 0{step}</h2>
          <h3 className="font-display text-4xl md:text-[56px] font-light text-text-main leading-[1.05] tracking-[-0.02em] mb-8">
            {step === 1 && "Суурь\nМэдээлэл"}
            {step === 2 && "Статус &\nБаталгаа"}
            {step === 3 && "Хорооны\nҮнэлгээ"}
          </h3>
          <p className="text-text-dim text-[16px] leading-[1.6] font-serif font-light max-w-sm">
            {step === 1 && "Бид хаалттай нийгэмлэгийг цогцлоохын тулд нарийн шалгуур тавьдаг бөгөөд таны мэдээлэл бүрэн нууцлагдана."}
            {step === 2 && "Карьер болон ажил эрхлэлтийн түүх нь манай гишүүдийн ижил түвшний үнэлэмжийг хадгалах гол хэмжүүр болдог."}
            {step === 3 && "Энэхүү хариулт нь хорооны шийдвэрт хамгийн хүчтэй нөлөөлөх хүчин зүйл байх болно."}
          </p>
        </div>

        {/* Right Column: Form Container */}
        <form onSubmit={nextStep} className="md:col-span-7 flex flex-col w-full bg-bg-base/20 border border-accent-20 p-10 backdrop-blur-sm">
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-12"
                >
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Овог, нэр</label>
                    <input required type="text" placeholder="Bat-Erdene T." className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Нас</label>
                      <input required min="21" type="number" placeholder="28" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                    </div>
                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Хүйс</label>
                      <select required className="w-full py-2 text-[18px] text-text-main bg-transparent appearance-none font-sans font-light cursor-pointer">
                        <option value="" disabled selected className="bg-bg-base text-text-dim">Сонгох...</option>
                        <option value="male" className="bg-bg-base">Эрэгтэй</option>
                        <option value="female" className="bg-bg-base">Эмэгтэй</option>
                      </select>
                    </div>
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Гар утас / Имэйл</label>
                    <input required type="text" placeholder="Утасны дугаар эсвэл имэйл" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  
                  <div className="group pt-4 border-t border-accent-20">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim mb-4 block">Гишүүнчлэлийн гол зорилго</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className="cursor-pointer group/radio relative">
                        <input type="radio" name="intent" value="network" required className="peer sr-only" />
                        <div className="border border-accent-20 p-4 hover:border-accent/50 peer-checked:border-accent peer-checked:bg-white/5 transition-all">
                          <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-1">Professional Network</div>
                          <div className="font-serif italic text-text-dim text-[13px]">Бизнесийн хүрээлэл болон карер тэлэх</div>
                        </div>
                      </label>
                      <label className="cursor-pointer group/radio relative">
                        <input type="radio" name="intent" value="social" required className="peer sr-only" />
                        <div className="border border-accent-20 p-4 hover:border-accent/50 peer-checked:border-accent peer-checked:bg-white/5 transition-all">
                          <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-1">Social Circle</div>
                          <div className="font-serif italic text-text-dim text-[13px]">Ижил үнэлэмжтэй найз нөхөд, хүрээлэл</div>
                        </div>
                      </label>
                      <label className="cursor-pointer group/radio relative">
                        <input type="radio" name="intent" value="romance" required className="peer sr-only" />
                        <div className="border border-accent-20 p-4 hover:border-accent/50 peer-checked:border-accent peer-checked:bg-white/5 transition-all">
                          <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-1">Romantic Connection</div>
                          <div className="font-serif italic text-text-dim text-[13px]">Хувийн харилцаа болон болзоо</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-12"
                >
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">LinkedIn Профайл (Заавал)</label>
                    <input required type="url" placeholder="https://linkedin.com/in/your-profile" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Одоогийн эрхэлж буй албан тушаал</label>
                    <input required type="text" placeholder="Жишээ: Marketing Director" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Байгууллагын нэр</label>
                    <input required type="text" placeholder="Жишээ: MCS Group, Golomt Bank..." className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-12"
                >
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Инстаграм (Сонголт)</label>
                    <input type="text" placeholder="@username" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="group space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim flex flex-col gap-3 group-focus-within:text-accent transition-colors">
                      <span>Та яагаад Noblr клубт гишүүнээр орох хүсэлтэй байна вэ? (Заавал)</span>
                    </label>
                    <textarea required rows={5} placeholder="Энд бичнэ үү..." className="w-full py-3 text-[16px] text-text-main placeholder-text-dim/30 resize-none font-serif leading-[1.8] bg-transparent border-0 border-b border-accent-20 focus:ring-0 focus:border-accent outline-none transition-colors" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-accent-20">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="text-[10px] tracking-[0.25em] font-caps uppercase text-text-dim hover:text-text-main transition-colors"
              >
                Буцах
              </button>
            ) : <div />}
            
            <button 
              type="submit"
              className="bg-accent text-bg-base px-10 py-4 text-[11px] font-caps tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-3"
            >
              {step === totalSteps ? 'Илгээх' : 'Үргэлжлүүлэх'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// --- WAITLIST VIEW ---
function WaitlistView() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      <div className="max-w-xl flex flex-col items-center relative z-10 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
          className="w-24 h-24 rounded-full border border-accent flex items-center justify-center mb-10 bg-[#0A0A0A] shadow-[0_0_50px_rgba(154,127,87,0.15)]"
        >
          <Lock className="w-8 h-8 text-accent" />
        </motion.div>

        <h1 className="text-[32px] md:text-[48px] font-display text-text-main font-light mb-6 leading-[1.1] tracking-[-0.01em]">
          Dossier Sealed.
        </h1>
        
        <p className="text-text-dim text-[16px] leading-[1.8] mb-12 font-serif font-light max-w-md">
          Таны анкет болон баталгаажуулах мэдээллүүд 암 шифрлэгдэн <span className="text-text-main italic font-sans whitespace-nowrap">Review Committee</span> (Хяналтын Хороо)-д хүлээлгэн өгөгдлөө.
        </p>

        <div className="w-full text-left bg-[#0A0A0A] border border-accent-20 p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle noise inside the box */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
          
          <div className="flex justify-between items-start mb-10 border-b border-accent-20 pb-6 relative z-10">
            <div>
              <div className="font-caps text-[9px] uppercase tracking-[0.3em] text-text-dim mb-1">Application ID</div>
              <div className="font-mono text-lg text-accent tracking-widest">#NBLR-9842A</div>
            </div>
            <div className="text-right">
              <div className="font-caps text-[9px] uppercase tracking-[0.3em] text-text-dim mb-1">Status</div>
              <div className="font-caps text-[11px] uppercase tracking-[0.2em] text-[#FF4A4A] flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF4A4A] animate-pulse" /> In Review
              </div>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end">
              <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim/60 uppercase">Identity Verification</span>
              <span className="font-caps text-[9px] tracking-[0.2em] text-text-main uppercase flex items-center gap-2">
                <Check className="w-3 h-3 text-accent" /> Completed
              </span>
            </div>
            <div className="flex justify-between items-end">
               <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim/60 uppercase">Background & Vetting</span>
               <span className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase flex items-center gap-2">
                 <div className="w-3 h-3 border border-t-transparent border-accent rounded-full animate-spin" /> Pending
               </span>
            </div>
            <div className="flex justify-between items-end">
               <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim/60 uppercase">Committee Vote</span>
               <span className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase">Awaiting</span>
            </div>
          </div>
        </div>

        <p className="mt-16 text-[12px] text-text-dim max-w-sm font-serif italic leading-relaxed font-light">
          We maintain a strict ratio to ensure the quality of connections. Acceptance is not guaranteed. 
          Please do not inquire about your application status. If approved, you will receive an encrypted dispatch.
        </p>
      </div>
    </motion.div>
  );
}

// --- LOGIN VIEW ---
function LoginView({ onLogin }: { onLogin: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="w-full max-w-md bg-bg-base/20 border border-accent-20 p-12 backdrop-blur-md relative z-10 text-left">
        <h2 className="font-display text-4xl font-light text-text-main mb-2 tracking-tight">Эргэн тавтай морил</h2>
        <p className="text-text-dim text-[14px] font-serif mb-10">Зөвхөн урилгатай гишүүдэд нээлттэй.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group space-y-3">
            <label className="text-[10px] uppercase font-caps tracking-[0.25em] text-text-dim group-focus-within:text-accent transition-colors">Нэвтрэх код эсвэл Имэйл</label>
            <input required type="text" placeholder="Утгаа оруулна уу" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
          </div>
          <div className="group space-y-3">
            <label className="text-[10px] uppercase font-caps tracking-[0.25em] text-text-dim group-focus-within:text-accent transition-colors">Нууц үг</label>
            <input required type="password" placeholder="••••••••" className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-accent text-bg-base py-4 text-[11px] font-caps tracking-[0.2em] uppercase hover:bg-white transition-colors mt-6"
          >
            Нэвтрэх
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// --- PORTAL VIEW ---
function PortalView() {
  const [activeTab, setActiveTab] = useState<'daily' | 'events' | 'introductions' | 'profile'>('daily');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [intentMode, setIntentMode] = useState(false);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  
  // Profile specific state
  const [phantomMode, setPhantomMode] = useState(false);
  const [activeIntents, setActiveIntents] = useState({ network: true, social: true, romance: false });
  const [isEditingDispatch, setIsEditingDispatch] = useState(false);
  const [dispatchTemplate, setDispatchTemplate] = useState("Сайн байна уу, таны профайл дээрх үзэл бодол сонирхол татлаа. Удахгүй болох арга хэмжээнүүдийн нэг дээр уулзаж ярилцах саналтай байна.");

  const MOCK_PROFILES = [
    {
      id: "0482",
      name: "Аялгуу",
      age: 29,
      role: "Senior Economist",
      company: "World Bank Mongolia",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      description: "Мэргэжлийн түвшинд өсөн дэвшсэн, ижил үнэлэмжтэй хүнтэй танилцаж, утга төгөлдөр нөхөрлөл эхлүүлэх сонирхолтой."
    },
    {
      id: "1933",
      name: "Тэмүүлэн",
      age: 34,
      role: "Managing Partner",
      company: "Tier 1 Law Firm",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      description: "Урлаг болон архитектурын гүн сонирхолтой. Ажлын бус цагаараа гольф тоглож, сайн дарс амтлах дуртай."
    },
    {
      id: "2015",
      name: "Сэлэнгэ",
      age: 27,
      role: "Founder & CEO",
      company: "Fintech Startup",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      description: "Дэлхийтэй хөл нийлүүлэн алхах алсын хараатай, шинэ зүйл туршихаас эмээдэггүй хүмүүстэй танилцах хүсэлтэй."
    }
  ];

  const PENDING_INTRODUCTIONS = [
    { id: "REDACTED", role: "Executive Board Member", intent: "Professional Network", time: "2 hrs ago" },
    { id: "REDACTED", role: "Contemporary Artist", intent: "Romantic Interest", time: "5 hrs ago" }
  ];

  const VERIFIED_ACCORDS = [
    { 
      id: "1094", 
      name: "Тэлмэн", 
      role: "Venture Capitalist", 
      intent: "Professional Network", 
      unread: true,
      status: "Pending Exchange",
      dispatch: "Сайн байна уу, өчигдрийн арга хэмжээн дээрх таны үзэл бодол сонирхол татлаа. Технологийн салбар дахь хөрөнгө оруулалтын талаар кофе уунгаа ярилцах саналтай байна.",
      coordinates: null
    },
    { 
      id: "0832", 
      name: "Хулан", 
      role: "Creative Director", 
      intent: "Social Circle", 
      unread: false,
      status: "Coordinates Exchanged",
      dispatch: "Art gallery-ийн curation маш их таалагдсан. Урлаг сонирхдог хүмүүсийн network-д нэгдэхэд таатай байх болно.",
      coordinates: "Telegram: @khulan_cd\nPhone: +976 9911-0832"
    }
  ];

  useEffect(() => {
    setIntentMode(false);
  }, [currentProfileIndex]);

  useEffect(() => {
    if (activeTab !== 'introductions') {
      setActiveConversation(null);
    }
  }, [activeTab]);

  const handleNextProfile = () => {
    setCurrentProfileIndex(prev => prev + 1);
  };

  const currentProfile = MOCK_PROFILES[currentProfileIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex-1 flex flex-col w-full max-w-5xl mx-auto py-8 px-4 md:px-8 mt-12 mb-20 md:mb-0 z-20"
    >
      {/* Desktop Tabs */}
      <div className="hidden md:flex border-b border-accent-20 mb-12 overflow-x-auto hide-scrollbar whitespace-nowrap">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'daily' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          Daily Selection
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'events' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          Private Events
        </button>
        <button 
          onClick={() => setActiveTab('introductions')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'introductions' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          Introductions
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'profile' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          My Profile
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#070707]/90 backdrop-blur-xl border-t border-accent-20 z-50 flex justify-around items-center px-2 py-4 pb-safe-offset-4">
        <button onClick={() => setActiveTab('daily')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'daily' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <Compass className={`w-5 h-5 ${activeTab === 'daily' ? 'text-accent' : ''}`} />
          <span className="text-[7px] font-caps uppercase tracking-widest">Dossier</span>
        </button>
        <button onClick={() => setActiveTab('events')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'events' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <Calendar className={`w-5 h-5 ${activeTab === 'events' ? 'text-accent' : ''}`} />
          <span className="text-[7px] font-caps uppercase tracking-widest">Events</span>
        </button>
        <button onClick={() => setActiveTab('introductions')} className={`flex flex-col items-center gap-1.5 transition-colors relative ${activeTab === 'introductions' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <Inbox className={`w-5 h-5 ${activeTab === 'introductions' ? 'text-accent' : ''}`} />
          {(VERIFIED_ACCORDS.some(a => a.unread) || PENDING_INTRODUCTIONS.length > 0) && (
            <div className="absolute -top-0.5 right-[15%] w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          )}
          <span className="text-[7px] font-caps uppercase tracking-widest">Inbound</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-accent' : ''}`} />
          <span className="text-[7px] font-caps uppercase tracking-widest">Profile</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'daily' && (
          <AnimatePresence mode="popLayout">
            {currentProfile ? (
              <motion.div 
                key={currentProfile.id}
                initial={{ opacity: 0, x: 50, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -50, filter: 'blur(5px)' }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="w-full border border-accent-20 bg-bg-base/30 backdrop-blur-sm p-8 md:p-12 relative overflow-hidden shadow-2xl"
              >
                {/* Dossier Header */}
                <div className="flex justify-between items-end border-b border-accent-20 pb-4 mb-12 relative z-10 w-full">
                  <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase">The Daily Dossier</div>
                  <div className="font-sans text-[10px] tracking-[0.1em] text-accent uppercase text-right">
                    Vol. IV &mdash; Issue 109<br/>
                    Curated for you
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
                  {/* Image Column */}
                  <div className="lg:col-span-5 relative w-full aspect-[3/4] md:aspect-auto md:h-[600px] border border-accent-20 p-2 bg-[#0E0C0A]">
                    <div className="absolute top-4 -right-8 font-caps text-[9px] tracking-[0.3em] text-accent uppercase rotate-90 origin-left hidden lg:block opacity-60">
                      Confidential
                    </div>
                    <img src={currentProfile.image} alt="Profile" className="w-full h-full object-cover filter brightness-90 contrast-125 sepia-[20%] grayscale-[30%]" />
                    <div className="absolute bottom-6 left-6 bg-bg-base/80 backdrop-blur-md px-4 py-2 border border-accent-20">
                      <div className="font-sans text-[9px] tracking-[0.25em] text-text-main uppercase">Member {currentProfile.id}</div>
                    </div>
                  </div>
                  
                  {/* Editorial Text Column */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase mb-4">Introduction</div>
                    <h2 className="font-display text-5xl md:text-7xl font-light text-text-main leading-[0.9] tracking-[-0.02em] mb-4">
                      {currentProfile.name}, <span className="text-text-dim italic">{currentProfile.age}</span>
                    </h2>
                    
                    <div className="font-sans text-[12px] tracking-[0.1em] text-text-main/60 uppercase mb-12 border-l-2 border-accent pl-4 py-1">
                      {currentProfile.role} <br/>
                      <span className="text-text-dim">{currentProfile.company}</span>
                    </div>
                    
                    <div>
                      <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-4">Profile Notes</div>
                      <p className="font-serif font-light text-[15px] leading-relaxed text-text-main/90 first-letter:float-left first-letter:text-6xl first-letter:font-display first-letter:pr-4 first-letter:pt-2 first-letter:text-accent">
                        {currentProfile.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col mt-16 pt-8 border-t border-accent-20 min-h-[100px] justify-center relative">
                      <AnimatePresence mode="wait">
                        {!intentMode ? (
                          <motion.div 
                            key="default-actions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-6 w-full"
                          >
                            <button onClick={handleNextProfile} className="text-[10px] font-caps tracking-[0.2em] text-text-dim hover:text-white uppercase transition-colors">
                              Archive & Pass
                            </button>
                            <button onClick={() => setIntentMode(true)} className="bg-text-main text-bg-base px-8 py-4 text-[10px] font-caps tracking-[0.2em] uppercase hover:bg-accent transition-colors ml-auto flex items-center gap-3 group">
                              <span>Request Connection</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="intent-actions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col w-full gap-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase">Define Connection Intent:</span>
                              <button onClick={() => setIntentMode(false)} className="text-[10px] text-text-dim hover:text-white uppercase tracking-[0.1em]">Cancel</button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <button onClick={handleNextProfile} className="w-full border border-accent-20 bg-bg-base/50 hover:bg-white hover:text-bg-base hover:border-white text-left px-6 py-4 flex items-center justify-between group transition-all duration-300">
                                <div>
                                  <div className="font-caps text-[11px] tracking-[0.2em] uppercase mb-1 group-hover:text-bg-base">Professional Network</div>
                                  <div className="font-serif italic text-text-dim text-[13px] group-hover:text-bg-base/70">Бизнесийн хүрээлэл, карер тэлэх</div>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </button>
                              <button onClick={handleNextProfile} className="w-full border border-accent-20 bg-bg-base/50 hover:bg-white hover:text-bg-base hover:border-white text-left px-6 py-4 flex items-center justify-between group transition-all duration-300">
                                <div>
                                  <div className="font-caps text-[11px] tracking-[0.2em] uppercase mb-1 group-hover:text-bg-base">Social Circle</div>
                                  <div className="font-serif italic text-text-dim text-[13px] group-hover:text-bg-base/70">Найз нөхөд, сонирхол нэгтэн</div>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </button>
                              <button onClick={handleNextProfile} className="w-full border border-accent-20 bg-bg-base/50 hover:bg-white hover:text-bg-base hover:border-white text-left px-6 py-4 flex items-center justify-between group transition-all duration-300">
                                <div>
                                  <div className="font-caps text-[11px] tracking-[0.2em] uppercase mb-1 group-hover:text-bg-base">Romantic Interest</div>
                                  <div className="font-serif italic text-text-dim text-[13px] group-hover:text-bg-base/70">Хувийн харилцаа, болзоо</div>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="font-display text-3xl font-light text-text-main mb-4">Жагсаалт дууслаа</div>
                <div className="font-serif italic text-text-dim text-[16px]">
                  Та өнөөдрийн онцгойプロфайлуудтай танилцаж дууслаа. Өдөр бүр шинэ сонголтууд нэмэгдэнэ.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {activeTab === 'events' && (
          <motion.div 
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-16"
          >
            <div className="flex justify-between items-end border-b border-accent-20 pb-4 relative z-10 w-full mb-8">
              <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase">Private Gatherings</div>
              <div className="font-sans text-[10px] tracking-[0.1em] text-accent uppercase text-right">
                Curated Access<br/>
                Strictly Non-Transferable
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {[
                {
                  id: "E-094",
                  title: "Tasting & Contemporary Art",
                  desc: "A closed-door evening examining neo-expressionist works, paired with curated vintages. Confidential attendance.",
                  date: "Nov 24, 2026",
                  location: "Location sent 24h prior via encrypted channel",
                  image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=1200",
                  status: "Waitlist Only",
                  capacity: "14",
                  filled: "14",
                  action: "Join Waitlist",
                  urgency: "Allocation exhausted."
                },
                {
                  id: "E-102",
                  title: "Founders' Discourse",
                  desc: "An intimate dialogue on macro-economics and frontier markets. Reserved for Tier-I members and strategic partners.",
                  date: "Dec 02, 2026",
                  location: "Private Residence, Bogd Khan Mountain",
                  image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200",
                  status: "By Approval",
                  capacity: "8",
                  filled: "5",
                  action: "Request Seat",
                  urgency: "3 seats remain. Closes in 48 hours."
                }
              ].map((evt, i) => (
                <div key={i} className="group relative border border-accent-20 bg-bg-base/50 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                  {/* Image Section */}
                  <div className="md:w-2/5 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-[#0E0C0A]">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-base via-transparent to-transparent md:bg-gradient-to-r" />
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md border border-accent/30 font-caps text-[8px] tracking-[0.2em] text-white uppercase">
                      Classified // {evt.id}
                    </div>
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover filter brightness-50 contrast-125 sepia-[30%] grayscale-[70%] group-hover:scale-105 group-hover:brightness-90 group-hover:grayscale-[20%] transition-all duration-1000" />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-between relative z-20">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="font-caps text-[10px] tracking-[0.25em] text-accent uppercase">{evt.date}</div>
                        <div className={`font-caps text-[9px] tracking-[0.2em] uppercase px-3 py-1 border ${evt.filled === evt.capacity ? 'border-text-dim/30 text-text-dim' : 'border-accent/40 text-accent/80'}`}>
                          {evt.status}
                        </div>
                      </div>
                      
                      <h3 className="font-display text-4xl border-l-[3px] border-accent pl-5 font-light text-text-main mb-6 tracking-tight leading-none group-hover:text-white transition-colors">{evt.title}</h3>
                      <p className="font-serif italic text-text-main/70 text-[15px] leading-relaxed mb-6">
                        "{evt.desc}"
                      </p>
                      <div className="font-sans text-[9px] tracking-[0.2em] text-text-dim uppercase flex items-center gap-3 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-20 block" />
                        {evt.location}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 border-t border-accent-20">
                      <div>
                        <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-2">Guest Allocation</div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-[2px]">
                            {[...Array(parseInt(evt.capacity))].map((_, idx) => (
                              <div key={idx} className={`w-1.5 h-4 ${idx < parseInt(evt.filled) ? 'bg-white/20' : 'bg-accent/80 animate-pulse'}`} />
                            ))}
                          </div>
                          <div className="font-sans text-[10px] text-text-main/50 tracking-widest pl-2">
                            {evt.filled} / {evt.capacity}
                          </div>
                        </div>
                        <div className={`mt-3 font-caps text-[8px] tracking-[0.2em] uppercase ${evt.filled === evt.capacity ? 'text-text-dim' : 'text-[#FF4A4A]'}`}>
                          {evt.urgency}
                        </div>
                      </div>
                      
                      <button className={`px-8 py-4 text-[10px] font-caps tracking-[0.2em] uppercase transition-colors flex items-center gap-3 shrink-0 ${evt.filled === evt.capacity ? 'bg-transparent text-text-dim border border-accent-20 cursor-not-allowed' : 'bg-text-main text-bg-base hover:bg-accent'}`}>
                        <span>{evt.action}</span>
                        {evt.filled !== evt.capacity && <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Past Events Archive */}
            <div className="mt-24 pt-16 border-t border-accent-20">
              <div className="flex justify-between items-end border-b border-accent-20 pb-4 mb-12">
                <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase">The Archive</div>
                <div className="font-sans text-[10px] tracking-[0.1em] text-accent/60 uppercase text-right">
                  Visual Records <span className="text-[#FF4A4A]">Purged</span><br/>
                  Privacy is paramount
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    id: "A-089",
                    title: "Midnight Symphony & Cigars",
                    desc: "A closed-door performance by a visiting state string quartet, accompanied by rare 1990 Cuban reserves. 10 minds gathered. Only memories remain.",
                    date: "Oct 12, 2026",
                  },
                  {
                    id: "A-073",
                    title: "The Autumn Equinox Retreat",
                    desc: "A two-day secluded dialogue between unicorn founders and frontier tech investors. Paired with Michelin-level private dining. What was said there, stays there.",
                    date: "Sep 22, 2026",
                  }
                ].map((evt, i) => (
                  <div key={i} className="group border border-accent-20 bg-bg-base/30 relative flex flex-col p-8 md:p-12">
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-display text-8xl leading-none select-none pointer-events-none">X</div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="font-caps text-[10px] tracking-[0.25em] text-accent/50 uppercase">{evt.date}</div>
                      <div className="font-caps text-[8px] tracking-[0.3em] text-[#FF4A4A] uppercase border border-[#FF4A4A]/30 px-2 py-1">
                        Concluded
                      </div>
                    </div>
                    
                    <h3 className="font-display text-3xl font-light text-text-main/50 mb-4 tracking-tight line-through decoration-accent/30 decoration-[1.5px]">{evt.title}</h3>
                    <p className="font-serif italic text-text-main/40 text-[14px] leading-relaxed mb-10 flex-1">
                      "{evt.desc}"
                    </p>
                    
                    <div className="w-full bg-[#0A0A0A] border border-accent/10 py-10 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Stylized Noise/Static pattern for "Redacted" feeling */}
                      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]" />
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 border border-[#FF4A4A]/40 rounded-full flex items-center justify-center mb-4">
                          <div className="w-[1px] h-4 bg-[#FF4A4A]/50 rotate-45 absolute" />
                          <div className="w-[1px] h-4 bg-[#FF4A4A]/50 -rotate-45 absolute" />
                        </div>
                        <div className="font-caps text-[9px] tracking-[0.3em] text-accent/40 uppercase mb-2">No Visual Records</div>
                        <div className="font-sans text-[10px] tracking-[0.1em] text-text-dim/40 uppercase text-center max-w-[200px]">Strict confidentiality enforced. Photography is prohibited.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'introductions' && (
          <motion.div 
            key="introductions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-12"
          >
            {activeConversation ? (
              <div className="w-full border border-accent-20 bg-[#0A0A0A] relative shadow-2xl flex flex-col min-h-[500px]">
                {/* Header */}
                <div className="px-8 py-5 border-b border-accent-20 flex justify-between items-center bg-[#070707] z-10 shrink-0">
                  <div className="flex items-center gap-6">
                    <button onClick={() => setActiveConversation(null)} className="text-[10px] uppercase font-caps tracking-[0.2em] text-text-dim hover:text-white transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 rotate-180 transform group-hover:-translate-x-1 transition-transform" />
                      Буцах
                    </button>
                    <div className="w-[1px] h-6 bg-accent-20" />
                    <div>
                      <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase flex items-center gap-2">
                        {activeConversation.status === "Pending Exchange" ? (
                          <><div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Pending Exchange</>
                        ) : (
                          <><Check className="w-3 h-3 text-accent" /> Coordinates Authorized</>
                        )}
                      </div>
                      <div className="font-display text-xl text-text-main mt-1 tracking-tight">Member {activeConversation.id} // {activeConversation.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase border border-accent-20 px-2 py-1">
                      Intent // {activeConversation.intent}
                    </div>
                  </div>
                </div>

                {/* Dispatch Area */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim/60 uppercase mb-6 flex items-center gap-4">
                    Initial Dispatch 
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-accent-20 to-transparent" />
                  </div>
                  
                  <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-text-main font-light italic mb-16 border-l-2 border-accent pl-6 lg:pl-10 relative">
                    <span className="absolute -left-[3px] top-0 text-[60px] leading-none text-accent/20 font-serif">"</span>
                    {activeConversation.dispatch}
                  </p>

                  {activeConversation.status === "Pending Exchange" ? (
                    <div className="border border-accent-20 bg-bg-base/30 p-8 text-center flex flex-col items-center">
                      <div className="font-caps text-[10px] tracking-[0.2em] text-accent/80 uppercase mb-4">Action Required</div>
                      <p className="font-sans text-[12px] text-text-dim max-w-sm mb-6 leading-relaxed font-light">
                        Бид таны цагийг үнэлдэг. Noblr дээр эцэс төгсгөлгүй чатлах шаардлагагүй. Хэрвээ та уг хүсэлтийг зөвшөөрвөл хувийн холбоо барих мэдээллийг (Contact Coordinates) харилцан солилцож, амьд амьдрал дээр харилцаагаа үргэлжлүүлнэ үү.
                      </p>
                      <div className="flex gap-4">
                        <button className="bg-transparent border border-accent-20 text-text-dim px-8 py-3 font-caps text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors">
                          Decline
                        </button>
                        <button className="bg-text-main text-bg-base px-8 py-3 font-caps text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors flex items-center gap-3 group">
                          Authorize Coordinate Exchange
                          <Lock className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-accent p-8 relative overflow-hidden bg-accent/5">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Check className="w-24 h-24" />
                      </div>
                      <div className="font-caps text-[10px] tracking-[0.2em] text-accent uppercase mb-6 flex items-center gap-3">
                        <Lock className="w-4 h-4" /> Coordinates Authorized
                      </div>
                      
                      <div className="bg-[#0A0A0A] border border-accent-20 p-6 flex items-center justify-between">
                        <pre className="font-mono text-[14px] text-text-main leading-loose whitespace-pre-wrap">
                          {activeConversation.coordinates}
                        </pre>
                        <button className="text-[10px] font-caps tracking-[0.2em] text-accent hover:text-white uppercase transition-colors px-4 py-2 border border-accent/30 hover:border-accent">
                          Copy
                        </button>
                      </div>
                      
                      <p className="font-sans text-[10px] tracking-[0.1em] text-text-dim uppercase mt-6 pt-4 border-t border-accent/20">
                        Please proceed via the secured channels above. Real connections happen in the real world.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-12 border-b border-accent-20 pb-8">
                  <h2 className="font-display text-4xl font-light text-text-main mb-4 tracking-tight">The Anti-Chat Philosophy.</h2>
                  <p className="font-serif italic text-text-dim text-[15px] leading-relaxed max-w-3xl">
                    Noblr is not designed for endless scrolling, idle texting, or dopamine loops. We value your time. 
                    Introductions happen through a single, formal dispatch. If mutual interest is established, coordinates are exchanged, 
                    and the conversation operates strictly offline. Real connections happen in the real world.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Column 1: Verified Accords (Matches) */}
                <div>
                  <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase mb-8 border-b border-accent-20 pb-4">
                    Verified Introductions ({VERIFIED_ACCORDS.length})
                  </div>
                  <div className="flex flex-col gap-4">
                    {VERIFIED_ACCORDS.map((accord, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveConversation(accord)}
                        className="w-full text-left group border border-accent-20 bg-bg-base/30 hover:bg-[#0E0C0A] transition-colors p-6 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-display text-2xl text-text-main tracking-tight group-hover:text-white transition-colors">{accord.name}</h4>
                            {accord.unread && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                          </div>
                          <div className="font-serif italic text-[14px] text-text-dim line-clamp-1">{accord.role}</div>
                          <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim/60 uppercase mt-4">Intent: {accord.intent}</div>
                        </div>
                        <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase border-b border-accent/30 group-hover:border-accent pb-1 transition-colors flex items-center gap-2 flex-shrink-0">
                          Direct Line <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2: Pending Inbound */}
                <div>
                  <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase mb-8 border-b border-accent-20 pb-4">
                    Pending Inbound ({PENDING_INTRODUCTIONS.length})
                  </div>
                  <div className="flex flex-col gap-4 opacity-70">
                    {PENDING_INTRODUCTIONS.map((pending, i) => (
                      <div key={i} className="w-full border border-accent-20 bg-bg-base/10 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 relative">
                            <h4 className="font-display text-2xl text-text-main/50 tracking-tight select-none">
                              <span className="blur-[4px]">Member X</span>
                            </h4>
                            <div className="font-sans text-[9px] tracking-[0.1em] text-text-dim uppercase">{pending.time}</div>
                          </div>
                          <div className="font-serif italic text-[14px] text-text-dim line-clamp-1 mb-4">
                            <span className="blur-[2px]">{pending.role}</span>
                          </div>
                          <div className="font-caps text-[8px] tracking-[0.2em] text-accent/60 uppercase">Intent: {pending.intent}</div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-accent-20/50">
                          <button className="flex-1 text-[9px] font-caps tracking-[0.2em] text-text-dim hover:text-[#FF4A4A] uppercase transition-colors text-left">
                            Decline
                          </button>
                          <button className="flex-1 text-[9px] font-caps tracking-[0.2em] text-accent hover:text-white uppercase transition-colors text-right">
                            Accept & Reveal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 font-serif italic text-[13px] text-text-dim text-center">
                    Pending requests remain anonymous to eliminate bias. Decisions cannot be reversed.
                  </p>
                </div>
              </div>
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-12"
          >
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Column 1: Identity & Card */}
              <div className="w-full lg:w-[340px] shrink-0 space-y-8">
                {/* Member Card */}
                <div className="w-full aspect-[1.618/1] bg-[#0E0C0A] border-[0.5px] border-accent/50 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                  <div className={`absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex items-center justify-center transition-opacity duration-500 ${phantomMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Phantom Mode Engaged
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none translate-x-10 -translate-y-10" />
                  <div className="flex justify-between items-start relative z-10 w-full">
                    <div className="font-display text-[22px] font-light tracking-[-0.005em]">Noblr</div>
                    <div className="font-sans text-[9px] tracking-[0.2em] uppercase text-text-dim/50">ID: 8092</div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <div className="font-display text-[18px] font-light mb-1 text-white">Түмэн-Эрдэнэ</div>
                      <div className="font-serif italic text-[12px] text-text-dim">Creative Director</div>
                    </div>
                    <div className="font-sans text-[9px] tracking-[0.2em] uppercase text-text-dim text-right leading-relaxed">
                      Member<br/>since 2026
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-accent-20 bg-bg-base/30 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-accent-20">
                    <div>
                      <div className="font-caps text-[10px] tracking-[0.2em] text-text-main uppercase mb-1">Phantom Mode</div>
                      <div className="font-sans text-[9px] text-text-dim font-light max-w-[200px]">Hide profile from Daily Selection. Only visible to verified connections.</div>
                    </div>
                    <button 
                      onClick={() => setPhantomMode(!phantomMode)}
                      className={`w-12 h-6 border transition-colors relative ${phantomMode ? 'border-accent bg-accent/10' : 'border-accent-20 bg-transparent'}`}
                    >
                      <div className={`absolute top-[3px] w-4 h-4 bg-white transition-all duration-300 ${phantomMode ? 'left-[25px] bg-accent' : 'left-[3px] bg-text-dim/50'}`} />
                    </button>
                  </div>
                  
                  <div className="pt-2">
                    <div className="font-caps text-[10px] tracking-[0.2em] text-text-dim uppercase mb-4">Membership Status</div>
                    <div className="flex items-center gap-3 text-white font-sans text-sm font-light">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      Active · Tier I
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column 2: Configurations */}
              <div className="flex-1 w-full space-y-12">
                
                {/* Active Intents */}
                <div>
                  <h4 className="font-display text-2xl font-light text-text-main mb-2">Connection Dimensions</h4>
                  <p className="font-serif text-[14px] text-text-dim mb-6 italic">Control which types of connections you are currently seeking. Changes reflect immediately.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setActiveIntents(prev => ({...prev, network: !prev.network}))}
                      className={`p-6 border text-left transition-colors ${activeIntents.network ? 'border-accent bg-accent/5' : 'border-accent-20 opacity-50 hover:opacity-100 hover:border-accent/40'}`}
                    >
                      <div className="font-caps text-[10px] tracking-[0.2em] uppercase mb-2 flex justify-between">
                        Professional
                        {activeIntents.network && <Check className="w-3 h-3 text-accent" />}
                      </div>
                      <div className="font-serif text-[12px] text-text-dim leading-relaxed">Expand professional network & business circles.</div>
                    </button>

                    <button 
                      onClick={() => setActiveIntents(prev => ({...prev, social: !prev.social}))}
                      className={`p-6 border text-left transition-colors ${activeIntents.social ? 'border-accent bg-accent/5' : 'border-accent-20 opacity-50 hover:opacity-100 hover:border-accent/40'}`}
                    >
                      <div className="font-caps text-[10px] tracking-[0.2em] uppercase mb-2 flex justify-between">
                        Social Circle
                        {activeIntents.social && <Check className="w-3 h-3 text-accent" />}
                      </div>
                      <div className="font-serif text-[12px] text-text-dim leading-relaxed">Meaningful friendships & shared interests.</div>
                    </button>

                    <button 
                      onClick={() => setActiveIntents(prev => ({...prev, romance: !prev.romance}))}
                      className={`p-6 border text-left transition-colors ${activeIntents.romance ? 'border-[#FF4A4A] bg-[#FF4A4A]/5 text-[#FF4A4A]' : 'border-accent-20 opacity-50 hover:opacity-100 hover:border-accent/40'}`}
                    >
                      <div className="font-caps text-[10px] tracking-[0.2em] uppercase mb-2 flex justify-between">
                        Romantic
                        {activeIntents.romance && <Check className="w-3 h-3" />}
                      </div>
                      <div className="font-serif text-[12px] text-text-dim leading-relaxed text-text-main/60">Seek a significant other.</div>
                    </button>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-accent-20" />

                {/* Dispatch Signature */}
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h4 className="font-display text-2xl font-light text-text-main mb-2">Standard Dispatch</h4>
                      <p className="font-serif text-[14px] text-text-dim italic">Your default crafted message when requesting an introduction.</p>
                    </div>
                    <button 
                      onClick={() => setIsEditingDispatch(!isEditingDispatch)}
                      className="font-caps text-[10px] tracking-[0.2em] text-accent uppercase hover:text-white transition-colors pb-1 border-b border-accent/40 hover:border-accent"
                    >
                      {isEditingDispatch ? 'Save Signature' : 'Edit Signature'}
                    </button>
                  </div>
                  
                  {isEditingDispatch ? (
                    <textarea 
                      value={dispatchTemplate}
                      onChange={(e) => setDispatchTemplate(e.target.value)}
                      className="w-full h-32 bg-[#0A0A0A] border border-accent p-6 font-serif italic text-text-main text-[15px] leading-relaxed resize-none focus:outline-none"
                    />
                  ) : (
                    <div className="w-full bg-[#0E0C0A] border border-accent-20 p-6 relative">
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-accent/40" />
                      <p className="font-serif italic text-text-main text-[16px] leading-[1.8] font-light">
                        "{dispatchTemplate}"
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="pt-8">
                   <button className="font-caps text-[10px] tracking-[0.2em] text-[#FF4A4A]/70 hover:text-[#FF4A4A] uppercase pb-1 transition-colors flex items-center gap-2">
                     <Lock className="w-3 h-3" /> Request Account Deactivation
                   </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdminView() {
  const MOCK_APPLICATIONS = [
    { id: "A-5491", name: "Ундрал", age: 31, company: "Tech Ventures LLC", position: "Product Manager", status: "PENDING", date: "2 mins ago" },
    { id: "A-5490", name: "Билгүүн", age: 35, company: "Oyu Tolgoi", position: "Senior Engineer", status: "PENDING", date: "1 hour ago" },
    { id: "A-5489", name: "Номин", age: 28, company: "PwC Mongolia", position: "Tax Consultant", status: "PENDING", date: "3 hours ago" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full max-w-6xl mx-auto py-8 z-20 px-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-accent-20 pb-6 mb-8 gap-4">
        <div>
          <h2 className="font-display text-3xl font-light text-text-main mb-2">Review Committee</h2>
          <p className="font-serif italic text-text-dim text-[14px]">Evaluation Dashboard</p>
        </div>
        <div className="font-caps text-[10px] tracking-[0.2em] text-accent uppercase">
           142 Pending Profiles
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
        <div className="border border-accent-20 bg-bg-base/30 backdrop-blur-sm overflow-hidden h-fit">
          <div className="hidden md:grid grid-cols-[100px_1fr_1fr_1fr_80px] gap-4 p-4 border-b border-accent-20 bg-accent/5 font-caps text-[9px] uppercase tracking-[0.2em] text-text-dim">
            <div>ID</div>
            <div>Applicant</div>
            <div>Role</div>
            <div>Time</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-accent-20">
            {MOCK_APPLICATIONS.map((app) => (
              <div key={app.id} className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_1fr_80px] gap-4 p-4 items-center hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="font-sans text-[11px] text-text-dim">{app.id}</div>
                <div>
                  <div className="font-sans font-light text-text-main text-[14px]">{app.name}, {app.age}</div>
                </div>
                <div>
                  <div className="font-serif italic text-[13px] text-text-dim truncate pr-4">{app.position}</div>
                  <div className="font-sans text-[10px] text-text-dim/60 truncate pr-4">{app.company}</div>
                </div>
                <div className="font-sans text-[11px] text-text-dim">{app.date}</div>
                <div className="flex justify-start md:justify-end opacity-50 md:opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-accent-20 bg-[#0E0C0A] p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none translate-x-10 -translate-y-10" />
          <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase mb-6 relative z-10">Application Details</div>
          
          <h3 className="font-display text-4xl font-light text-text-main mb-1 relative z-10">Ундрал, 31</h3>
          <div className="font-serif italic text-text-dim text-[14px] mb-8 relative z-10">Product Manager @ Tech Ventures LLC</div>
          
          <div className="space-y-8 flex-1 relative z-10">
            <div>
              <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Intent Statement</div>
              <p className="font-serif font-light text-[15px] leading-[1.8] text-text-main/80 italic">
                "Би шинийг санаачлагч, өөртөө итгэлтэй салбарынхаа шилдэг залуустай танилцаж, хүрээллээ тэлэхийн сацуу хувийн амьдралдаа тогтвортой харилцааг эрэлхийлж байна."
              </p>
            </div>
            
            <div>
              <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Social Validation</div>
              <a href="#" className="font-sans font-light text-[13px] text-accent hover:underline flex items-center gap-2">
                linkedin.com/in/undral-p
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 pt-6 border-t border-accent-20 relative z-10">
            <button className="w-full sm:flex-1 border border-accent-20 py-4 text-[10px] font-caps tracking-[0.2em] text-text-dim uppercase hover:bg-white/5 transition-colors">
              Reject
            </button>
            <button className="w-full sm:flex-1 bg-accent text-bg-base py-4 text-[10px] font-caps tracking-[0.2em] uppercase hover:bg-white transition-colors">
              Approve
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

