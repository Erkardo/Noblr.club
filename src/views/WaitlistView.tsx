import { motion } from 'motion/react';
import { Lock, Check, X } from 'lucide-react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { Spinner } from '../components/ui/Spinner';
import { useAppContext } from '../context/AppContext';

export function WaitlistView() {
  const { lastApplicationId, applications } = useAppContext();
  const application = lastApplicationId
    ? applications.find(a => a.id === lastApplicationId) ?? null
    : null;

  const status = application?.status ?? 'PENDING';
  const displayId = application?.id ?? '#NBLR-9842A';

  const statusColor =
    status === 'APPROVED' ? 'text-accent' :
    status === 'REJECTED' ? 'text-[#FF4A4A]' :
    'text-[#FF4A4A]';

  const statusLabel =
    status === 'APPROVED' ? 'Accepted' :
    status === 'REJECTED' ? 'Declined' :
    'In Review';

  const headline =
    status === 'APPROVED' ? 'Invitation extended.' :
    status === 'REJECTED' ? 'Not this cycle.' :
    'Dossier Sealed.';

  const subcopy =
    status === 'APPROVED'
      ? 'Таны өргөдлийг хүлээн зөвшөөрлөө. Урилгын мэдээллийг удахгүй илгээнэ.'
      : status === 'REJECTED'
      ? 'Энэ удаагийн шалгаруулалтаар танд урилга олгогдсонгүй. Хороо дараагийн drop-д дахин үнэлэх боломжтой.'
      : <>Таны анкет болон баталгаажуулах мэдээллүүд шифрлэгдэн <span className="text-text-main italic font-sans whitespace-nowrap">Review Committee</span> (Хяналтын Хороо)-д хүлээлгэн өгөгдлөө.</>;

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      className="flex-1 flex flex-col items-center justify-center text-center px-5 md:px-6 py-12 md:py-20 relative"
    >
      <NoiseOverlay />

      <div className="max-w-xl flex flex-col items-center relative z-10 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full border flex items-center justify-center mb-8 md:mb-10 bg-[#0A0A0A] shadow-[0_0_50px_rgba(154,127,87,0.15)] ${status === 'REJECTED' ? 'border-[#FF4A4A]/60' : 'border-accent'}`}
        >
          {status === 'APPROVED' ? <Check className="w-8 h-8 text-accent" /> :
           status === 'REJECTED' ? <X className="w-8 h-8 text-[#FF4A4A]" /> :
           <Lock className="w-8 h-8 text-accent" />}
        </motion.div>

        <h1 className="text-[28px] md:text-[48px] font-display text-text-main font-light mb-5 md:mb-6 leading-[1.1] tracking-[-0.01em]">
          {headline}
        </h1>

        <p className="text-text-dim text-[15px] md:text-[16px] leading-[1.8] mb-10 md:mb-12 font-serif font-light max-w-md">
          {subcopy}
        </p>

        <div className="w-full text-left bg-[#0A0A0A] border border-accent-20 p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

          <div className="flex justify-between items-start mb-8 md:mb-10 border-b border-accent-20 pb-5 md:pb-6 relative z-10">
            <div>
              <div className="font-caps text-[9px] uppercase tracking-[0.3em] text-text-dim mb-1">Application ID</div>
              <div className="font-mono text-base md:text-lg text-accent tracking-widest break-all">{displayId}</div>
              {application?.name && (
                <div className="font-serif italic text-[12px] text-text-dim mt-2">{application.name}</div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="font-caps text-[9px] uppercase tracking-[0.3em] text-text-dim mb-1">Status</div>
              <div className={`font-caps text-[10px] md:text-[11px] uppercase tracking-[0.2em] ${statusColor} flex items-center gap-2 justify-end`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'APPROVED' ? 'bg-accent' : status === 'REJECTED' ? 'bg-[#FF4A4A]' : 'bg-[#FF4A4A] animate-pulse'}`} /> {statusLabel}
              </div>
            </div>
          </div>

          <div className="space-y-5 md:space-y-6 relative z-10">
            <div className="flex justify-between items-end">
              <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim/60 uppercase">Identity Verification</span>
              <span className="font-caps text-[9px] tracking-[0.2em] text-text-main uppercase flex items-center gap-2">
                <Check className="w-3 h-3 text-accent" /> Completed
              </span>
            </div>
            <div className="flex justify-between items-end">
               <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim/60 uppercase">Background &amp; Vetting</span>
               <span className={`font-caps text-[9px] tracking-[0.2em] uppercase flex items-center gap-2 ${status === 'PENDING' ? 'text-accent' : 'text-text-main'}`}>
                 {status === 'PENDING' ? <><Spinner size="w-3 h-3" /> Pending</> : <><Check className="w-3 h-3 text-accent" /> Completed</>}
               </span>
            </div>
            <div className="flex justify-between items-end">
               <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim/60 uppercase">Committee Vote</span>
               <span className={`font-caps text-[9px] tracking-[0.2em] uppercase flex items-center gap-2 ${
                 status === 'APPROVED' ? 'text-accent' :
                 status === 'REJECTED' ? 'text-[#FF4A4A]' :
                 'text-text-dim'
               }`}>
                 {status === 'APPROVED' ? <><Check className="w-3 h-3" /> Approved</> :
                  status === 'REJECTED' ? <><X className="w-3 h-3" /> Declined</> :
                  'Awaiting'}
               </span>
            </div>
          </div>
        </div>

        <p className="mt-12 md:mt-16 text-[12px] text-text-dim max-w-sm font-serif italic leading-relaxed font-light">
          {status === 'PENDING'
            ? 'We maintain a strict ratio to ensure the quality of connections. Acceptance is not guaranteed. Please do not inquire about your application status. If approved, you will receive an encrypted dispatch.'
            : status === 'APPROVED'
            ? 'Welcome to Noblr. Your member credentials will arrive via encrypted dispatch.'
            : 'We appreciate your interest. Thank you for applying to Noblr.'}
        </p>
      </div>
    </motion.div>
  );
}
