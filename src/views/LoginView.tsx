import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { useAppContext } from '../context/AppContext';

// Accepted access code formats (any of these passes):
//   NBLR-MEMBER-YYYY  — universal demo code (e.g. NBLR-MEMBER-2026)
//   NBLR-XXXX         — four-digit member shorthand (e.g. NBLR-0247)
//   email@domain.tld  — email + password (min 6 chars) — flavor path
const CODE_MEMBER = /^NBLR-MEMBER-\d{4}$/i;
const CODE_SHORT = /^NBLR-\d{4}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_DISPATCH_KEY = 6;

export function LoginView({ onLogin }: { onLogin: () => void }) {
  const { currentMember } = useAppContext();
  const [code, setCode] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const validate = (): string | null => {
    const c = code.trim();
    const k = key.trim();
    if (!c) return 'Нэвтрэх код оруулна уу.';
    if (!k) return 'Dispatch key оруулна уу.';
    if (k.length < MIN_DISPATCH_KEY) return `Dispatch key дор хаяж ${MIN_DISPATCH_KEY} тэмдэгт.`;

    const looksMember = CODE_MEMBER.test(c);
    const looksShort = CODE_SHORT.test(c);
    const looksEmail = EMAIL_REGEX.test(c);
    const looksOwnNumber = c === currentMember.memberNumber;

    if (!looksMember && !looksShort && !looksEmail && !looksOwnNumber) {
      return 'Dispatch code таарахгүй байна.';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = validate();
    if (err) { setError(err); return; }

    setVerifying(true);
    // Theatrical verification pause
    setTimeout(() => {
      setVerifying(false);
      onLogin();
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="flex-1 flex flex-col items-center justify-center text-center px-5 md:px-6"
    >
      <NoiseOverlay />
      <div className="w-full max-w-md bg-bg-2/50 border border-accent-20 p-8 md:p-12 backdrop-blur-md relative z-10 text-left">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-4 h-4 text-accent" />
          <span className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase">Member access</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-light text-text-main mb-2 tracking-tight">Эргэн тавтай морил</h2>
        <p className="text-text-dim text-[14px] font-serif mb-10">Зөвхөн урилгатай гишүүдэд нээлттэй.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group space-y-3">
            <label className="text-[10px] uppercase font-caps tracking-[0.25em] text-text-dim group-focus-within:text-accent transition-colors">Dispatch code</label>
            <input
              required
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value); if (error) setError(null); }}
              placeholder="NBLR-0247 · member@noblr.club"
              className="w-full py-2 text-[16px] text-text-main placeholder-text-dim/30 font-mono font-light tracking-wider"
            />
          </div>
          <div className="group space-y-3">
            <label className="text-[10px] uppercase font-caps tracking-[0.25em] text-text-dim group-focus-within:text-accent transition-colors">Dispatch key</label>
            <input
              required
              type="password"
              value={key}
              onChange={e => { setKey(e.target.value); if (error) setError(null); }}
              placeholder="••••••••"
              className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light"
            />
          </div>

          {error && (
            <div className="font-sans text-[12px] text-error border-l-2 border-error/60 pl-3 py-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={verifying}
            className="w-full bg-accent text-bg-base py-4 text-[11px] font-caps tracking-[0.2em] uppercase hover:bg-accent-deep transition-colors mt-6 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {verifying ? (
              <>
                <div className="w-3 h-3 rounded-full border border-bg-base border-t-transparent animate-spin" />
                Verifying...
              </>
            ) : 'Нэвтрэх'}
          </button>

          <div className="pt-4 font-sans text-[10px] tracking-[0.15em] text-text-dim/60 uppercase leading-relaxed border-t border-accent-20">
            Dispatch code нь таны member number (№) эсвэл бидний илгээсэн идэвхжүүлэх имэйлд байна.
          </div>
        </form>
      </div>
    </motion.div>
  );
}
