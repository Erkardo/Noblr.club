import { motion } from 'motion/react';
import { Lock, Check } from 'lucide-react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { Spinner } from '../components/ui/Spinner';

export function WaitlistView() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative"
    >
      <NoiseOverlay />

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
                 <Spinner size="w-3 h-3" /> Pending
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
