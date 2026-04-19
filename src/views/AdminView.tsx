import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Check, RotateCcw, Sparkles, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateText, isGeminiAvailable } from '../services/gemini';

const BRIEF_SYSTEM = `You are advising the Noblr private society's admissions committee. Given a candidate dossier, produce a concise brief in Mongolian Cyrillic with exactly three sections: "Давуу тал" (2-3 bullet points), "Анхаарах" (2-3 bullet points), and "Зөвлөмж" (one-line recommendation: Accept / Hold / Decline with a short justification). Tone: Monocle-level measured editorial, confident but not flattering. Keep the entire brief under 140 words.`;

export function AdminView() {
  const { applications, setApplications, resetDemoData } = useAppContext();
  const firstPendingId = applications.find(a => a.status === 'PENDING')?.id ?? applications[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(firstPendingId);
  const [brief, setBrief] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const selected = applications.find(a => a.id === selectedId) ?? null;
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const geminiReady = isGeminiAvailable();

  const handleDecision = (decision: 'APPROVED' | 'REJECTED') => {
    if (!selectedId) return;
    setApplications(prev => prev.map(a => a.id === selectedId ? { ...a, status: decision } : a));
    const nextPending = applications.find(a => a.status === 'PENDING' && a.id !== selectedId);
    setSelectedId(nextPending?.id ?? null);
    setBrief(null);
    setBriefError(null);
  };

  const handleSelectRow = (id: string) => {
    setSelectedId(id);
    setBrief(null);
    setBriefError(null);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all demo data? This restores default applications, introductions, and profile preferences.')) return;
    resetDemoData();
    setSelectedId(null);
    setBrief(null);
    setBriefError(null);
  };

  const handleGenerateBrief = async () => {
    if (!selected) return;
    setBriefLoading(true);
    setBriefError(null);
    setBrief(null);
    try {
      const prompt = `Candidate dossier:\nName: ${selected.name}\nAge: ${selected.age}\nRole: ${selected.position}\nCompany: ${selected.company}\nLinkedIn: ${selected.linkedin ?? '—'}\nIntent statement: "${selected.intentStatement ?? '—'}"\n\nProduce the committee brief now.`;
      const result = await generateText(prompt, BRIEF_SYSTEM);
      setBrief(result.trim());
    } catch (err: unknown) {
      setBriefError(err instanceof Error ? err.message : 'AI хариу өгч чадсангүй.');
    } finally {
      setBriefLoading(false);
    }
  };

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
        <div className="flex items-center gap-6">
          <button
            onClick={handleReset}
            title="Reset demo data"
            className="font-caps text-[9px] tracking-[0.2em] text-text-dim/60 uppercase hover:text-[#FF4A4A] transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <div className="font-caps text-[10px] tracking-[0.2em] text-accent uppercase">
             {pendingCount + 139} Pending Profiles
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
        <div className="border border-accent-20 bg-bg-base/30 backdrop-blur-sm overflow-hidden h-fit">
          <div className="hidden md:grid grid-cols-[100px_1fr_1fr_1fr_80px] gap-4 p-4 border-b border-accent-20 bg-accent/5 font-caps text-[9px] uppercase tracking-[0.2em] text-text-dim">
            <div>ID</div>
            <div>Applicant</div>
            <div>Role</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-accent-20">
            {applications.map((app) => {
              const isSelected = app.id === selectedId;
              const isDecided = app.status !== 'PENDING';
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectRow(app.id)}
                  className={`grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_1fr_80px] gap-4 p-4 items-center cursor-pointer group transition-colors ${isSelected ? 'bg-accent/10' : 'hover:bg-white/5'} ${isDecided ? 'opacity-50' : ''}`}
                >
                  <div className="font-sans text-[11px] text-text-dim">{app.id}</div>
                  <div>
                    <div className={`font-sans font-light text-text-main text-[14px] ${isDecided ? 'line-through' : ''}`}>{app.name}, {app.age}</div>
                  </div>
                  <div>
                    <div className="font-serif italic text-[13px] text-text-dim truncate pr-4">{app.position}</div>
                    <div className="font-sans text-[10px] text-text-dim/60 truncate pr-4">{app.company}</div>
                  </div>
                  <div className={`font-caps text-[9px] tracking-[0.2em] uppercase ${app.status === 'APPROVED' ? 'text-accent' : app.status === 'REJECTED' ? 'text-[#FF4A4A]' : 'text-text-dim'}`}>
                    {app.status === 'PENDING' ? app.date : app.status}
                  </div>
                  <div className="flex justify-start md:justify-end opacity-50 md:opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent-20 bg-[#0E0C0A] p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none translate-x-10 -translate-y-10" />
          <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase mb-6 relative z-10">Application Details</div>

          {selected ? (
            <>
              <h3 className="font-display text-4xl font-light text-text-main mb-1 relative z-10">{selected.name}, {selected.age}</h3>
              <div className="font-serif italic text-text-dim text-[14px] mb-8 relative z-10">{selected.position} @ {selected.company}</div>

              <div className="space-y-8 flex-1 relative z-10">
                <div>
                  <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Intent Statement</div>
                  <p className="font-serif font-light text-[15px] leading-[1.8] text-text-main/80 italic">
                    "{selected.intentStatement ?? '—'}"
                  </p>
                </div>

                <div>
                  <div className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase mb-3">Social Validation</div>
                  <a href="#" className="font-sans font-light text-[13px] text-accent hover:underline flex items-center gap-2">
                    {selected.linkedin ?? '—'}
                  </a>
                </div>
              </div>

              {selected.status === 'PENDING' ? (
                <div className="mt-12 pt-6 border-t border-accent-20 relative z-10 space-y-4">
                  <button
                    onClick={handleGenerateBrief}
                    disabled={!geminiReady || briefLoading}
                    title={geminiReady ? 'Gemini-ээр дүгнэлт бичүүлэх' : 'Gemini API key тохируулаагүй'}
                    className="w-full border border-accent/30 bg-accent/5 py-3 text-[10px] font-caps tracking-[0.2em] text-accent uppercase hover:bg-accent/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3 h-3" />
                    {briefLoading ? 'Дүгнэж байна...' : 'Generate Committee Brief'}
                  </button>
                  {briefError && <div className="font-sans text-[11px] text-[#FF4A4A]">{briefError}</div>}
                  {brief && (
                    <div className="border border-accent/20 bg-[#0A0A0A] p-5 font-serif text-[13px] leading-[1.8] text-text-main/80 whitespace-pre-wrap">
                      {brief}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => handleDecision('REJECTED')}
                      className="w-full sm:flex-1 border border-accent-20 py-4 text-[10px] font-caps tracking-[0.2em] text-text-dim uppercase hover:bg-white/5 hover:text-[#FF4A4A] transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-3 h-3" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecision('APPROVED')}
                      className="w-full sm:flex-1 bg-accent text-bg-base py-4 text-[10px] font-caps tracking-[0.2em] uppercase hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-12 pt-6 border-t border-accent-20 relative z-10">
                  <div className={`font-caps text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 py-3 ${selected.status === 'APPROVED' ? 'text-accent' : 'text-[#FF4A4A]'}`}>
                    {selected.status === 'APPROVED' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {selected.status}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 py-20">
              <div className="font-display text-2xl font-light text-text-main mb-2">Queue Cleared</div>
              <div className="font-serif italic text-text-dim text-[14px]">No applications awaiting review.</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
