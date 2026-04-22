import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, Lock, Pencil, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { generateText, isGeminiAvailable } from '../../services/gemini';
import { InvitationsPanel } from '../../components/InvitationsPanel';

type Tone = 'formal' | 'warm' | 'direct';

const REFINE_SYSTEM = `You refine dispatch templates for Noblr, a Mongolian invite-only private society. Keep the user's core intent but rewrite the message in the requested tone, in Mongolian Cyrillic. 2-3 sentences, 40-70 words. No exclamation marks, no emojis. Return only the rewritten message — no preface, no explanation.`;

export function MyProfileTab() {
  const {
    phantomMode, setPhantomMode,
    activeIntents, setActiveIntents,
    dispatchTemplate, setDispatchTemplate,
    currentMember, setCurrentMember, setView,
  } = useAppContext();
  const [isEditingDispatch, setIsEditingDispatch] = useState(false);
  const [tone, setTone] = useState<Tone>('warm');
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: currentMember.name, role: currentMember.role });
  const geminiReady = isGeminiAvailable();

  const memberSinceYear = new Date().getFullYear();

  const handleSaveProfile = () => {
    setCurrentMember(prev => ({
      ...prev,
      name: profileDraft.name.trim() || prev.name,
      role: profileDraft.role.trim() || prev.role,
    }));
    setIsEditingProfile(false);
  };

  const handleDeactivate = () => {
    if (!window.confirm('Account deactivation is irreversible for this device. Continue?')) return;
    // Clear personal state and return to landing
    setPhantomMode(false);
    setView('landing');
  };

  const handleRefine = async () => {
    setRefining(true);
    setRefineError(null);
    try {
      const prompt = `Current template:\n"${dispatchTemplate}"\n\nRewrite in tone: ${tone} (${tone === 'formal' ? 'formal, reserved' : tone === 'warm' ? 'warm, personable but measured' : 'direct, concise, confident'}).`;
      const refined = await generateText(prompt, REFINE_SYSTEM);
      setDispatchTemplate(refined.trim().replace(/^["']|["']$/g, ''));
    } catch (err: unknown) {
      setRefineError(err instanceof Error ? err.message : 'AI хариу өгч чадсангүй.');
    } finally {
      setRefining(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-12"
    >
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
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
              <div className="flex items-center gap-2">
                {currentMember.patronSince && (
                  <span className="font-caps text-[8px] tracking-[0.25em] text-accent uppercase border border-accent/50 px-1.5 py-[1px] flex items-center gap-1">
                    <Sparkles className="w-2 h-2" /> Patron
                  </span>
                )}
                <div className="font-sans text-[9px] tracking-[0.2em] uppercase text-text-dim/50">{currentMember.memberNumber}</div>
              </div>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <div>
                <div className="font-display text-[18px] font-light mb-1 text-white">{currentMember.name}</div>
                <div className="font-serif italic text-[12px] text-text-dim">{currentMember.role}</div>
              </div>
              <div className="font-sans text-[9px] tracking-[0.2em] uppercase text-text-dim text-right leading-relaxed">
                Member<br/>since {memberSinceYear}
              </div>
            </div>
          </div>

          {/* Edit profile panel */}
          {isEditingProfile ? (
            <div className="p-5 border border-accent/50 bg-accent/5 space-y-4">
              <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase">Edit Dossier</div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim">Name</label>
                <input
                  value={profileDraft.name}
                  onChange={e => setProfileDraft(p => ({ ...p, name: e.target.value }))}
                  className="w-full py-2 text-[15px] text-text-main font-sans font-light"
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] font-caps text-text-dim">Role</label>
                <input
                  value={profileDraft.role}
                  onChange={e => setProfileDraft(p => ({ ...p, role: e.target.value }))}
                  className="w-full py-2 text-[15px] text-text-main font-sans font-light"
                  placeholder="Creative Director..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setProfileDraft({ name: currentMember.name, role: currentMember.role }); setIsEditingProfile(false); }}
                  className="flex-1 font-caps text-[10px] tracking-[0.2em] text-text-dim uppercase border border-accent-20 py-2 hover:text-text-main transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 font-caps text-[10px] tracking-[0.2em] text-bg-base uppercase bg-accent py-2 hover:bg-white transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full font-caps text-[10px] tracking-[0.2em] text-text-dim uppercase hover:text-accent transition-colors pb-1 border-b border-accent-20 hover:border-accent flex items-center justify-center gap-2"
            >
              <Pencil className="w-3 h-3" />
              Edit Dossier
            </button>
          )}

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

          {/* Invitations */}
          <InvitationsPanel />

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
              <div className="space-y-3">
                <textarea
                  value={dispatchTemplate}
                  onChange={(e) => setDispatchTemplate(e.target.value)}
                  className="w-full h-32 bg-[#0A0A0A] border border-accent p-6 font-serif italic text-text-main text-[15px] leading-relaxed resize-none focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="font-caps text-[9px] tracking-[0.2em] text-text-dim uppercase">Tone:</span>
                  {(['formal', 'warm', 'direct'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`font-caps text-[9px] tracking-[0.2em] uppercase px-3 py-1 border transition-colors ${tone === t ? 'border-accent text-accent bg-accent/5' : 'border-accent-20 text-text-dim hover:border-accent/50 hover:text-text-main'}`}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleRefine}
                    disabled={!geminiReady || refining}
                    title={geminiReady ? 'Gemini-ээр дипшч цэгцлэх' : 'Gemini API key тохируулаагүй'}
                    className="ml-auto font-caps text-[9px] tracking-[0.2em] text-accent uppercase hover:text-white transition-colors pb-1 border-b border-accent/40 hover:border-accent flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-accent disabled:hover:border-accent/40"
                  >
                    <Sparkles className="w-3 h-3" />
                    {refining ? 'Цэгцэлж байна...' : 'Refine with AI'}
                  </button>
                </div>
                {refineError && <div className="font-sans text-[11px] text-[#FF4A4A]">{refineError}</div>}
              </div>
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
             <button
               onClick={handleDeactivate}
               className="font-caps text-[10px] tracking-[0.2em] text-[#FF4A4A]/70 hover:text-[#FF4A4A] uppercase pb-1 transition-colors flex items-center gap-2"
             >
               <Lock className="w-3 h-3" /> Request Account Deactivation
             </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
