import { motion } from 'motion/react';
import React from 'react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';

export function LoginView({ onLogin }: { onLogin: () => void }) {
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
      <NoiseOverlay />
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
