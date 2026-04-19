import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { Spinner } from '../components/ui/Spinner';
import { useAppContext } from '../context/AppContext';
import { generateText, isGeminiAvailable } from '../services/gemini';
import type { Application } from '../types';

const DRAFT_SYSTEM = `You are helping a Mongolian professional write a short membership essay for Noblr, an invite-only private society positioned like Soho House or Raya. Register: confident, measured, culturally grounded, not aspirational-cringe. Do not flatter the club. Write 2-3 paragraphs in Mongolian Cyrillic, 80-180 words total. Speak honestly about why they want to join — tie their professional context to their intent. No exclamation marks, no hashtags, no English.`;

type IntentValue = 'network' | 'social' | 'romance';

interface FormState {
  name: string;
  age: string;
  gender: string;
  contact: string;
  intent: IntentValue | '';
  linkedin: string;
  position: string;
  company: string;
  instagram: string;
  motivation: string;
}

const INITIAL_FORM: FormState = {
  name: '', age: '', gender: '', contact: '', intent: '',
  linkedin: '', position: '', company: '',
  instagram: '', motivation: '',
};

const MOTIVATION_MIN = 80;

export function ApplicationView({ onComplete }: { onComplete: () => void }) {
  const { setApplications } = useAppContext();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const geminiReady = isGeminiAvailable();
  const totalSteps = 3;

  const handleDraftWithAI = async () => {
    setDraftError(null);
    setIsDrafting(true);
    try {
      const intentLabel = { network: 'Professional Network', social: 'Social Circle', romance: 'Romantic Connection', '': 'general interest' }[form.intent];
      const prompt = `Role/position: ${form.position || 'not provided'}\nCompany: ${form.company || 'not provided'}\nMain membership intent: ${intentLabel}\nWrite the essay now.`;
      const draft = await generateText(prompt, DRAFT_SYSTEM);
      update('motivation', draft.trim());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI хариу өгч чадсангүй.';
      setDraftError(msg);
    } finally {
      setIsDrafting(false);
    }
  };

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (current: number): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (current === 2) {
      if (form.linkedin && !/linkedin\.com/i.test(form.linkedin)) {
        next.linkedin = 'LinkedIn URL байх ёстой (linkedin.com).';
      }
    }
    if (current === 3) {
      const motivationLen = form.motivation.trim().length;
      if (motivationLen > 0 && motivationLen < MOTIVATION_MIN) {
        next.motivation = `Дор хаяж ${MOTIVATION_MIN} тэмдэгт (${motivationLen}/${MOTIVATION_MIN}).`;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitApplication = () => {
    const newApp: Application = {
      id: `A-${Math.floor(5500 + Math.random() * 500)}`,
      name: form.name || 'Applicant',
      age: parseInt(form.age) || 28,
      company: form.company || '—',
      position: form.position || '—',
      status: 'PENDING',
      date: 'just now',
      intentStatement: form.motivation,
      linkedin: form.linkedin,
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitApplication();
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
        <NoiseOverlay />

        <div className="w-[300px] h-[1px] bg-accent-20 overflow-hidden mb-12 relative">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-1/2 h-full bg-accent absolute top-0 left-0"
          />
        </div>

        <div className="flex flex-col gap-4 font-caps text-[10px] text-accent/60 uppercase tracking-[0.3em] items-center">
          <Spinner className="mb-4" />
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
      <NoiseOverlay />
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
                    <input required type="text" placeholder="Bat-Erdene T." value={form.name} onChange={e => update('name', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Нас</label>
                      <input required min="21" type="number" placeholder="28" value={form.age} onChange={e => update('age', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                    </div>
                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Хүйс</label>
                      <select required value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full py-2 text-[18px] text-text-main bg-transparent appearance-none font-sans font-light cursor-pointer">
                        <option value="" disabled className="bg-bg-base text-text-dim">Сонгох...</option>
                        <option value="male" className="bg-bg-base">Эрэгтэй</option>
                        <option value="female" className="bg-bg-base">Эмэгтэй</option>
                      </select>
                    </div>
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Гар утас / Имэйл</label>
                    <input required type="text" placeholder="Утасны дугаар эсвэл имэйл" value={form.contact} onChange={e => update('contact', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>

                  <div className="group pt-4 border-t border-accent-20">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim mb-4 block">Гишүүнчлэлийн гол зорилго</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className="cursor-pointer group/radio relative">
                        <input type="radio" name="intent" value="network" required checked={form.intent === 'network'} onChange={() => update('intent', 'network')} className="peer sr-only" />
                        <div className="border border-accent-20 p-4 hover:border-accent/50 peer-checked:border-accent peer-checked:bg-white/5 transition-all">
                          <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-1">Professional Network</div>
                          <div className="font-serif italic text-text-dim text-[13px]">Бизнесийн хүрээлэл болон карер тэлэх</div>
                        </div>
                      </label>
                      <label className="cursor-pointer group/radio relative">
                        <input type="radio" name="intent" value="social" required checked={form.intent === 'social'} onChange={() => update('intent', 'social')} className="peer sr-only" />
                        <div className="border border-accent-20 p-4 hover:border-accent/50 peer-checked:border-accent peer-checked:bg-white/5 transition-all">
                          <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-1">Social Circle</div>
                          <div className="font-serif italic text-text-dim text-[13px]">Ижил үнэлэмжтэй найз нөхөд, хүрээлэл</div>
                        </div>
                      </label>
                      <label className="cursor-pointer group/radio relative">
                        <input type="radio" name="intent" value="romance" required checked={form.intent === 'romance'} onChange={() => update('intent', 'romance')} className="peer sr-only" />
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
                    <input required type="url" placeholder="https://linkedin.com/in/your-profile" value={form.linkedin} onChange={e => update('linkedin', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                    {errors.linkedin && <div className="font-sans text-[11px] text-[#FF4A4A] mt-1">{errors.linkedin}</div>}
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Одоогийн эрхэлж буй албан тушаал</label>
                    <input required type="text" placeholder="Жишээ: Marketing Director" value={form.position} onChange={e => update('position', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Байгууллагын нэр</label>
                    <input required type="text" placeholder="Жишээ: MCS Group, Golomt Bank..." value={form.company} onChange={e => update('company', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
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
                    <input type="text" placeholder="@username" value={form.instagram} onChange={e => update('instagram', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </div>
                  <div className="group space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">
                        Та яагаад Noblr клубт гишүүнээр орох хүсэлтэй байна вэ? (Заавал)
                      </label>
                      <button
                        type="button"
                        onClick={handleDraftWithAI}
                        disabled={!geminiReady || isDrafting}
                        title={geminiReady ? 'Gemini-ээр төсөл бичүүлэх' : 'Gemini API key тохируулаагүй'}
                        className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase hover:text-white transition-colors pb-1 border-b border-accent/40 hover:border-accent flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-accent disabled:hover:border-accent/40"
                      >
                        <Sparkles className="w-3 h-3" />
                        {isDrafting ? 'Бичиж байна...' : 'Draft with AI'}
                      </button>
                    </div>
                    <textarea required rows={5} placeholder="Энд бичнэ үү..." value={form.motivation} onChange={e => update('motivation', e.target.value)} className="w-full py-3 text-[16px] text-text-main placeholder-text-dim/30 resize-none font-serif leading-[1.8] bg-transparent border-0 border-b border-accent-20 focus:ring-0 focus:border-accent outline-none transition-colors" />
                    {draftError && <div className="font-sans text-[11px] text-[#FF4A4A]">{draftError}</div>}
                    {errors.motivation && <div className="font-sans text-[11px] text-[#FF4A4A]">{errors.motivation}</div>}
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
