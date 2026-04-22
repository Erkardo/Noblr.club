import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { MOCK_PROFILES } from '../../data/profiles';
import { useAppContext } from '../../context/AppContext';
import type { Intent } from '../../types';

function getWeekOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

export function DailySelectionTab() {
  const {
    phantomMode,
    outboundRequests, setOutboundRequests,
    archivedProfileIds, setArchivedProfileIds,
  } = useAppContext();
  const [intentMode, setIntentMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableProfiles = MOCK_PROFILES.filter(p =>
    !archivedProfileIds.includes(p.id) &&
    !outboundRequests.some(r => r.profileId === p.id)
  );
  const currentProfile = availableProfiles[0];

  const handleArchive = () => {
    if (!currentProfile) return;
    setArchivedProfileIds(prev => [...prev, currentProfile.id]);
    setIntentMode(false);
  };

  const handleDispatch = (intent: Intent) => {
    if (!currentProfile) return;
    setOutboundRequests(prev => [...prev, { profileId: currentProfile.id, intent, sentAt: Date.now() }]);
    setIntentMode(false);
    setToast('Dispatch sent.');
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <>
      {phantomMode && (
        <div className="mb-6 border border-accent/40 bg-accent/5 px-6 py-3 flex items-center gap-3 font-caps text-[10px] tracking-[0.25em] text-accent uppercase">
          <Lock className="w-3 h-3" />
          Phantom mode: active — your dossier is hidden from Daily Selection.
        </div>
      )}
      <AnimatePresence mode="popLayout">
        {currentProfile ? (
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 0, x: 50, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -50, filter: 'blur(5px)' }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="w-full border border-accent-20 bg-bg-base/30 backdrop-blur-sm p-5 md:p-12 relative overflow-hidden shadow-2xl"
        >
          {/* Dossier Header */}
          <div className="flex justify-between items-end border-b border-accent-20 pb-4 mb-12 relative z-10 w-full">
            <div>
              <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase">The Monday Dossier</div>
              <div className="font-serif italic text-[11px] text-accent/80 mt-1">
                Week of {new Date().toLocaleDateString('mn-MN', { day: '2-digit', month: 'short' })}
              </div>
            </div>
            <div className="font-sans text-[10px] tracking-[0.1em] text-accent uppercase text-right">
              Vol. IV &mdash; Issue {getWeekOfYear()}<br/>
              Curated for you
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10">
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
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-text-main leading-[0.9] tracking-[-0.02em] mb-4">
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
                      <button onClick={handleArchive} className="text-[10px] font-caps tracking-[0.2em] text-text-dim hover:text-white uppercase transition-colors">
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
                        <button onClick={() => handleDispatch('network')} className="w-full border border-accent-20 bg-bg-base/50 hover:bg-white hover:text-bg-base hover:border-white text-left px-6 py-4 flex items-center justify-between group transition-all duration-300">
                          <div>
                            <div className="font-caps text-[11px] tracking-[0.2em] uppercase mb-1 group-hover:text-bg-base">Professional Network</div>
                            <div className="font-serif italic text-text-dim text-[13px] group-hover:text-bg-base/70">Бизнесийн хүрээлэл, карер тэлэх</div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                        <button onClick={() => handleDispatch('social')} className="w-full border border-accent-20 bg-bg-base/50 hover:bg-white hover:text-bg-base hover:border-white text-left px-6 py-4 flex items-center justify-between group transition-all duration-300">
                          <div>
                            <div className="font-caps text-[11px] tracking-[0.2em] uppercase mb-1 group-hover:text-bg-base">Social Circle</div>
                            <div className="font-serif italic text-text-dim text-[13px] group-hover:text-bg-base/70">Найз нөхөд, сонирхол нэгтэн</div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                        <button onClick={() => handleDispatch('romance')} className="w-full border border-accent-20 bg-bg-base/50 hover:bg-white hover:text-bg-base hover:border-white text-left px-6 py-4 flex items-center justify-between group transition-all duration-300">
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
          <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase mb-4">Next Dossier — Monday 08:00</div>
          <div className="font-display text-3xl md:text-4xl font-light text-text-main mb-4 max-w-md leading-tight">
            Энэ долоо хоногийн <span className="italic text-text-dim">танилцуулга дууслаа.</span>
          </div>
          <div className="font-serif italic text-text-dim text-[15px] max-w-md leading-relaxed">
            Даваа гарагийн өглөө 08:00 цагт шинэ dossier илгээгдэнэ. Хүлээлт бол Noblr-ийн ёс заншил — бид хурдан биш, чанарлаг харьцаа барьдаг.
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0E0C0A] border border-accent/40 px-6 py-3 font-caps text-[10px] tracking-[0.2em] text-accent uppercase shadow-xl flex items-center gap-3"
          >
            <Check className="w-3 h-3" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
