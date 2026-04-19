import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { UPCOMING_EVENTS, PAST_EVENTS } from '../../data/events';
import { useAppContext } from '../../context/AppContext';

export function PrivateEventsTab() {
  const { bookedEventIds, setBookedEventIds } = useAppContext();
  const [toast, setToast] = useState<string | null>(null);

  const handleRequestSeat = (eventId: string) => {
    if (bookedEventIds.includes(eventId)) return;
    setBookedEventIds(prev => [...prev, eventId]);
    setToast('Request submitted. You will be contacted via encrypted channel.');
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <motion.div
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
        {UPCOMING_EVENTS.map((evt, i) => {
          const isBooked = bookedEventIds.includes(evt.id);
          const capacity = parseInt(evt.capacity);
          const effectiveFilled = Math.min(parseInt(evt.filled) + (isBooked ? 1 : 0), capacity);
          const isFull = effectiveFilled >= capacity;
          return (
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
                  <div className={`font-caps text-[9px] tracking-[0.2em] uppercase px-3 py-1 border ${isFull ? 'border-text-dim/30 text-text-dim' : 'border-accent/40 text-accent/80'}`}>
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
                      {[...Array(capacity)].map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-4 ${idx < effectiveFilled ? 'bg-white/20' : 'bg-accent/80 animate-pulse'}`} />
                      ))}
                    </div>
                    <div className="font-sans text-[10px] text-text-main/50 tracking-widest pl-2">
                      {effectiveFilled} / {capacity}
                    </div>
                  </div>
                  <div className={`mt-3 font-caps text-[8px] tracking-[0.2em] uppercase ${isFull ? 'text-text-dim' : 'text-[#FF4A4A]'}`}>
                    {evt.urgency}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestSeat(evt.id)}
                  disabled={isFull || isBooked}
                  className={`px-8 py-4 text-[10px] font-caps tracking-[0.2em] uppercase transition-colors flex items-center gap-3 shrink-0 ${isFull || isBooked ? 'bg-transparent text-text-dim border border-accent-20 cursor-not-allowed' : 'bg-text-main text-bg-base hover:bg-accent'}`}
                >
                  <span>{isBooked ? 'Requested' : evt.action}</span>
                  {isBooked ? <Check className="w-3 h-3" /> : !isFull && <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
          </div>
          );
        })}
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
          {PAST_EVENTS.map((evt, i) => (
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
    </motion.div>
  );
}
