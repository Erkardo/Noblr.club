import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { Spinner } from '../components/ui/Spinner';
import { useAppContext } from '../context/AppContext';
import { generateText, isGeminiAvailable } from '../services/gemini';
import type { Application } from '../types';

type IntentValue = 'network' | 'social' | 'romance';
type ExperienceBracket = '3-5' | '5-10' | '10-15' | '15+';

interface FormState {
  // I — Identity
  name: string;
  birthday: string;   // ISO YYYY-MM-DD
  gender: 'male' | 'female' | '';
  phone: string;
  email: string;
  // II — Digital presence (username only, prefix shown inline)
  instagram: string;
  facebook: string;
  linkedin: string;
  // III — Standing
  position: string;
  company: string;
  experience: ExperienceBracket | '';
  education: string;
  // IV — Character
  intent: IntentValue | '';
  motivation: string;
  influences: string;
  depositAccepted: boolean;
}

const INITIAL_FORM: FormState = {
  name: '', birthday: '', gender: '', phone: '', email: '',
  instagram: '', facebook: '', linkedin: '',
  position: '', company: '', experience: '', education: '',
  intent: '', motivation: '', influences: '',
  depositAccepted: false,
};

const MOTIVATION_MIN = 100;
const INFLUENCES_MIN = 80;
const MIN_AGE = 26;

// Compute age from ISO birthday (YYYY-MM-DD)
function computeAge(iso: string): number {
  if (!iso) return 0;
  const birth = new Date(iso);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MIN_DIGITS = 8;

const STEP_LABELS = ['I', 'II', 'III', 'IV'];
const STEP_TITLES = ['Танилт', 'Дижитал\nоршихуй', 'Байр\nсуурь', 'Зан\nүнэлэмж'];
const STEP_COPY = [
  'Бидэнд эхэнд мэдэх шаардлагатай зүйлс. Мэдээлэл бүрэн нууцлагдана.',
  'Гурван платформ дээрх таны нүүр царай. Private бол хороо үнэлэхгүй.',
  'Карер болон боловсролын түүх. Ижил түвшний гишүүдтэй нийцэх эсэхийг харах хэмжүүр.',
  'Эцсийн шалгалт. Таны сэтгэлгээ, үнэлэмж, өөрийгөө илэрхийлэх чадвар хамгийн хүчтэй жинг эзэлнэ.',
];

const DRAFT_SYSTEM = `You are helping a Mongolian professional write a short membership essay for Noblr, an invite-only private society positioned like Soho House or Raya. Register: confident, measured, culturally grounded, not aspirational-cringe. Do not flatter the club. Write 2-3 paragraphs in Mongolian Cyrillic, 100-200 words total. Speak honestly about why they want to join — tie their professional context to their intent. No exclamation marks, no hashtags, no English.`;

// strip common prefixes / @ signs and whitespace from social inputs
function cleanHandle(raw: string, prefix: string): string {
  return raw.trim()
    .replace(/^https?:\/\//i, '')
    .replace(new RegExp(`^${prefix.replace(/\./g, '\\.')}`, 'i'), '')
    .replace(/^@/, '')
    .replace(/\/$/, '');
}

export function ApplicationView({ onComplete }: { onComplete: () => void }) {
  const { setApplications, setLastApplicationId, pendingInvite, setInvites, clearPendingInvite } = useAppContext();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const geminiReady = isGeminiAvailable();
  const totalSteps = 4;

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (current: number): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (current === 1) {
      if (!form.name.trim()) next.name = 'Нэр оруулна уу.';
      if (!form.birthday) next.birthday = 'Төрсөн өдрөө сонгоно уу.';
      else {
        const age = computeAge(form.birthday);
        if (age < MIN_AGE) next.birthday = `Доод нас ${MIN_AGE}.`;
      }
      if (!form.gender) next.gender = 'Хүйс сонгоно уу.';
      const phoneDigits = form.phone.replace(/\D/g, '');
      if (!form.phone.trim()) next.phone = 'Утасны дугаар оруулна уу.';
      else if (phoneDigits.length < PHONE_MIN_DIGITS) next.phone = 'Утасны дугаар бүрэн биш.';
      if (!form.email.trim()) next.email = 'Имэйл оруулна уу.';
      else if (!EMAIL_REGEX.test(form.email.trim())) next.email = 'Имэйл форматтай биш.';
    }
    if (current === 2) {
      if (!form.instagram.trim()) next.instagram = 'Instagram username шаардлагатай.';
      if (!form.facebook.trim()) next.facebook = 'Facebook username шаардлагатай.';
      if (!form.linkedin.trim()) next.linkedin = 'LinkedIn username шаардлагатай.';
    }
    if (current === 3) {
      if (!form.position.trim()) next.position = 'Албан тушаал оруулна уу.';
      if (!form.company.trim()) next.company = 'Байгууллага оруулна уу.';
      if (!form.experience) next.experience = 'Карерын нас сонгоно уу.';
      if (!form.education.trim()) next.education = 'Их сургууль оруулна уу.';
    }
    if (current === 4) {
      if (!form.intent) next.intent = 'Гишүүнчлэлийн зорилго сонгоно уу.';
      if (form.motivation.trim().length < MOTIVATION_MIN) {
        next.motivation = `Дор хаяж ${MOTIVATION_MIN} тэмдэгт (${form.motivation.trim().length}/${MOTIVATION_MIN}).`;
      }
      if (form.influences.trim().length < INFLUENCES_MIN) {
        next.influences = `Дор хаяж ${INFLUENCES_MIN} тэмдэгт (${form.influences.trim().length}/${INFLUENCES_MIN}).`;
      }
      if (!form.depositAccepted) next.depositAccepted = 'Хураамжийн зөвшөөрөл шаардлагатай.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitApplication = () => {
    const appId = `A-${Math.floor(5500 + Math.random() * 500)}`;
    const computedAge = computeAge(form.birthday) || 28;
    const newApp: Application = {
      id: appId,
      name: form.name || 'Applicant',
      age: computedAge,
      company: form.company || '—',
      position: form.position || '—',
      status: 'PENDING',
      date: 'just now',
      intentStatement: form.motivation,
      linkedin: form.linkedin ? `linkedin.com/in/${form.linkedin}` : undefined,
      inviteCode: pendingInvite?.code,
      sponsorMemberNumber: pendingInvite?.issuedByMemberNumber,
      sponsorName: pendingInvite?.issuedByName,
      birthday: form.birthday,
      gender: form.gender || undefined,
      phone: form.phone,
      email: form.email,
      instagram: form.instagram ? `instagram.com/${form.instagram}` : undefined,
      facebook: form.facebook ? `facebook.com/${form.facebook}` : undefined,
      experience: form.experience || undefined,
      education: form.education,
      influences: form.influences,
      depositAccepted: form.depositAccepted,
    };
    setApplications(prev => [newApp, ...prev]);
    setLastApplicationId(appId);

    if (pendingInvite) {
      setInvites(prev => prev.map(inv =>
        inv.code === pendingInvite.code
          ? { ...inv, claimedByApplicationId: appId, claimedAt: Date.now() }
          : inv
      ));
      clearPendingInvite();
    }
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
      }, 3500);
    }
  };

  const handleDraftWithAI = async () => {
    setDraftError(null);
    setIsDrafting(true);
    try {
      const intentLabel = { network: 'Professional Network', social: 'Social Circle', romance: 'Romantic Connection', '': 'general interest' }[form.intent];
      const prompt = `Role/position: ${form.position || 'not provided'}\nCompany: ${form.company || 'not provided'}\nEducation: ${form.education || 'not provided'}\nMain membership intent: ${intentLabel}\nWrite the essay now.`;
      const draft = await generateText(prompt, DRAFT_SYSTEM);
      update('motivation', draft.trim());
    } catch (err: unknown) {
      setDraftError(err instanceof Error ? err.message : 'AI хариу өгч чадсангүй.');
    } finally {
      setIsDrafting(false);
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>Verifying social footprint...</motion.div>
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
      className="flex-1 flex flex-col justify-center px-4 md:px-8 py-10 md:py-16 w-full max-w-6xl mx-auto"
    >
      <NoiseOverlay />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-24 items-start relative z-10 w-full">
        {/* Left: Progress & Info */}
        <div className="md:col-span-5 flex flex-col md:sticky md:top-32">
          {pendingInvite && (
            <div className="mb-8 inline-flex items-center gap-3 font-caps text-[9px] tracking-[0.3em] text-accent uppercase border-l border-accent pl-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Sponsored • {pendingInvite.issuedByMemberNumber} · <span className="italic text-text-dim tracking-normal normal-case">{pendingInvite.issuedByName}</span>
            </div>
          )}
          <div className="flex gap-2 mb-10">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-[1px] flex-1 transition-colors duration-700 ${i + 1 <= step ? 'bg-accent' : 'bg-accent-20'}`}
              />
            ))}
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display italic text-accent text-[20px] font-light">{STEP_LABELS[step - 1]}</span>
            <span className="font-caps text-[10px] tracking-[0.3em] text-text-dim uppercase">Chapter</span>
          </div>
          <h3 className="font-display text-[40px] md:text-[56px] font-light text-text-main leading-[1.05] tracking-[-0.02em] mb-8 whitespace-pre-line">
            {STEP_TITLES[step - 1]}
          </h3>
          <p className="text-text-dim text-[16px] leading-[1.6] font-serif font-light max-w-sm">
            {STEP_COPY[step - 1]}
          </p>
          <div className="mt-10 font-caps text-[9px] tracking-[0.25em] text-text-dim/70 uppercase">
            Дундаж хугацаа · ~3 минут
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={nextStep} className="md:col-span-7 flex flex-col w-full bg-bg-base/20 border border-accent-20 p-6 md:p-10 backdrop-blur-sm">
          <div className="min-h-[440px]">
            <AnimatePresence mode="wait">
              {/* Step I — Identity */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-8"
                >
                  <Field label="Овог, нэр" error={errors.name}>
                    <input required type="text" placeholder="Bat-Erdene T." value={form.name} onChange={e => update('name', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Field
                      label="Төрсөн өдөр"
                      error={errors.birthday}
                      hint={form.birthday && computeAge(form.birthday) >= MIN_AGE ? `${computeAge(form.birthday)} нас` : `≥ ${MIN_AGE}`}
                    >
                      <input
                        required
                        type="date"
                        value={form.birthday}
                        onChange={e => update('birthday', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full py-2 text-[16px] text-text-main placeholder-text-dim/30 font-sans font-light appearance-none [color-scheme:dark]"
                      />
                    </Field>

                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">Хүйс</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: 'male' as const, label: 'Эрэгтэй' },
                          { value: 'female' as const, label: 'Эмэгтэй' },
                        ]).map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => update('gender', opt.value)}
                            className={`py-3 border text-[12px] font-sans transition-colors ${form.gender === opt.value ? 'border-accent text-text-main bg-accent/5' : 'border-accent-20 text-text-dim hover:border-accent/40 hover:text-text-main'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {errors.gender && <div className="font-sans text-[11px] text-[#FF4A4A]">{errors.gender}</div>}
                    </div>
                  </div>

                  <Field label="Гар утас" error={errors.phone}>
                    <input required type="tel" placeholder="+976 9911-XXXX" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full py-2 text-[16px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </Field>

                  <Field label="Имэйл" error={errors.email}>
                    <input required type="email" placeholder="name@email.com" value={form.email} onChange={e => update('email', e.target.value)} className="w-full py-2 text-[16px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </Field>
                </motion.div>
              )}

              {/* Step II — Digital presence */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-8"
                >
                  <PrefixField
                    label="Instagram"
                    prefix="instagram.com/"
                    value={form.instagram}
                    onChange={v => update('instagram', cleanHandle(v, 'instagram.com/'))}
                    error={errors.instagram}
                    placeholder="your_username"
                  />
                  <PrefixField
                    label="Facebook"
                    prefix="facebook.com/"
                    value={form.facebook}
                    onChange={v => update('facebook', cleanHandle(v, 'facebook.com/'))}
                    error={errors.facebook}
                    placeholder="your.username"
                  />
                  <PrefixField
                    label="LinkedIn"
                    prefix="linkedin.com/in/"
                    value={form.linkedin}
                    onChange={v => update('linkedin', cleanHandle(v, 'linkedin.com/in/'))}
                    error={errors.linkedin}
                    placeholder="your-name"
                  />
                  <div className="pt-4 border-t border-accent-20 font-serif italic text-[12px] text-text-dim leading-relaxed">
                    Профайл бүрэн нээлттэй, жинхэнэ нэрээр байх шаардлагатай. Private эсвэл хоосон профайл хорооны үнэлгээнд ирэхгүй.
                  </div>
                </motion.div>
              )}

              {/* Step III — Standing */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-10"
                >
                  <Field label="Одоогийн албан тушаал" error={errors.position}>
                    <input required type="text" placeholder="Managing Partner, Senior Engineer..." value={form.position} onChange={e => update('position', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </Field>
                  <Field label="Байгууллага" error={errors.company}>
                    <input required type="text" placeholder="MCS Group, Golomt Bank, World Bank..." value={form.company} onChange={e => update('company', e.target.value)} className="w-full py-2 text-[18px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </Field>

                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim">Карерын нас</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['3-5', '5-10', '10-15', '15+'] as ExperienceBracket[]).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => update('experience', opt)}
                          className={`py-3 border text-[12px] font-caps tracking-[0.15em] uppercase transition-colors ${form.experience === opt ? 'border-accent text-text-main bg-accent/5' : 'border-accent-20 text-text-dim hover:border-accent/40 hover:text-text-main'}`}
                        >
                          {opt} <span className="normal-case tracking-normal text-text-dim/70">жил</span>
                        </button>
                      ))}
                    </div>
                    {errors.experience && <div className="font-sans text-[11px] text-[#FF4A4A] mt-1">{errors.experience}</div>}
                  </div>

                  <Field label="Боловсрол (их сургууль, зэрэг)" error={errors.education}>
                    <input required type="text" placeholder="НУМ, Эдийн засгийн магистр · Harvard, MBA..." value={form.education} onChange={e => update('education', e.target.value)} className="w-full py-2 text-[16px] text-text-main placeholder-text-dim/30 font-sans font-light" />
                  </Field>
                </motion.div>
              )}

              {/* Step IV — Character */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-10"
                >
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim">Гишүүнчлэлийн гол зорилго</label>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { value: 'network' as const, title: 'Professional Network', desc: 'Бизнесийн хүрээлэл болон карер тэлэх' },
                        { value: 'social' as const, title: 'Social Circle', desc: 'Ижил үнэлэмжтэй найз нөхөд, хүрээлэл' },
                        { value: 'romance' as const, title: 'Romantic Connection', desc: 'Хувийн харилцаа болон болзоо' },
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('intent', opt.value)}
                          className={`text-left p-4 border transition-all ${form.intent === opt.value ? 'border-accent bg-white/5' : 'border-accent-20 hover:border-accent/50'}`}
                        >
                          <div className="font-caps text-[11px] tracking-[0.2em] text-white uppercase mb-1">{opt.title}</div>
                          <div className="font-serif italic text-text-dim text-[13px]">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                    {errors.intent && <div className="font-sans text-[11px] text-[#FF4A4A]">{errors.intent}</div>}
                  </div>

                  {/* Essay 1 */}
                  <div className="group space-y-3 pt-4 border-t border-accent-20">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim">
                        Эссэ I · Таны шалтгаан
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
                    <div className="font-serif italic text-[13px] text-text-dim">
                      Та яагаад Noblr-т орохыг хүсэж байна вэ?
                    </div>
                    <textarea
                      required
                      rows={5}
                      placeholder="3-5 өгүүлбэрээр чөлөөтэй бичнэ үү. Яагаад одоо, яагаад Noblr..."
                      value={form.motivation}
                      onChange={e => update('motivation', e.target.value)}
                      className="w-full py-3 text-[15px] text-text-main placeholder-text-dim/30 resize-none font-serif leading-[1.8] bg-transparent border-0 border-b border-accent-20 focus:ring-0 focus:border-accent outline-none transition-colors"
                    />
                    {draftError && <div className="font-sans text-[11px] text-[#FF4A4A]">{draftError}</div>}
                    {errors.motivation && <div className="font-sans text-[11px] text-[#FF4A4A]">{errors.motivation}</div>}
                  </div>

                  {/* Essay 2 — the reflective filter */}
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim">
                      Эссэ II · Сэтгэлгээний өөрчлөлт
                    </label>
                    <div className="font-serif italic text-[13px] text-text-dim">
                      Сүүлийн 1 жилд таны сэтгэлгээг хамгийн их өөрчилсөн хүн, ном, уулзалт эсвэл туршлагын тухай бичнэ үү.
                    </div>
                    <textarea
                      required
                      rows={4}
                      placeholder="Нэр, шалтгаан. Товч, эргэцүүлэл маягтайгаар..."
                      value={form.influences}
                      onChange={e => update('influences', e.target.value)}
                      className="w-full py-3 text-[15px] text-text-main placeholder-text-dim/30 resize-none font-serif leading-[1.8] bg-transparent border-0 border-b border-accent-20 focus:ring-0 focus:border-accent outline-none transition-colors"
                    />
                    {errors.influences && <div className="font-sans text-[11px] text-[#FF4A4A]">{errors.influences}</div>}
                  </div>

                  {/* Deposit consent */}
                  <label className="flex items-start gap-3 cursor-pointer group pt-4 border-t border-accent-20">
                    <input
                      type="checkbox"
                      checked={form.depositAccepted}
                      onChange={e => update('depositAccepted', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border border-accent-20 flex items-center justify-center shrink-0 mt-0.5 peer-checked:border-accent peer-checked:bg-accent/10 transition-all">
                      <Check className={`w-3 h-3 text-accent transition-opacity duration-200 ${form.depositAccepted ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-sans text-[14px] text-text-main font-light">
                        ₮50,000 шалгаруулалтын хураамжийг зөвшөөрч байна.
                      </div>
                      <div className="font-serif italic text-[12px] text-text-dim mt-0.5">
                        Шалгарваагүй тохиолдолд бүрэн буцаан олгогдоно.
                      </div>
                      {errors.depositAccepted && <div className="font-sans text-[11px] text-[#FF4A4A] mt-2">{errors.depositAccepted}</div>}
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 md:mt-12 flex justify-between items-center pt-6 md:pt-8 border-t border-accent-20">
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
              {step === totalSteps ? 'Хянан үнэлгээнд илгээх' : 'Үргэлжлүүлэх'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/* ————— helpers ————— */

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="group space-y-3">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">
          {label}
        </label>
        {hint && <span className="font-sans text-[10px] text-text-dim/50">{hint}</span>}
      </div>
      {children}
      {error && <div className="font-sans text-[11px] text-[#FF4A4A]">{error}</div>}
    </div>
  );
}

function PrefixField({ label, prefix, value, onChange, error, placeholder }: {
  label: string; prefix: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string;
}) {
  return (
    <div className="group space-y-3">
      <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim group-focus-within:text-accent transition-colors">
        {label}
      </label>
      <div className="flex items-center border-b border-accent-20 focus-within:border-accent transition-colors">
        <span className="font-mono text-[13px] text-text-dim/70 py-2 pr-0.5 select-none whitespace-nowrap">{prefix}</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 py-2 text-[16px] text-text-main placeholder-text-dim/30 font-mono font-light bg-transparent outline-none min-w-0"
        />
      </div>
      {error && <div className="font-sans text-[11px] text-[#FF4A4A]">{error}</div>}
    </div>
  );
}
