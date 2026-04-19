import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Accord, PendingIntroduction } from '../../types';

const PLACEHOLDER_COORDINATES = "Telegram: @revealed_soon\nPhone: +976 99XX-XXXX";

export function IntroductionsTab() {
  const {
    pendingIntroductions: PENDING_INTRODUCTIONS,
    setPendingIntroductions,
    verifiedAccords: VERIFIED_ACCORDS,
    setVerifiedAccords,
  } = useAppContext();
  const [activeConversation, setActiveConversation] = useState<Accord | null>(null);
  const [copiedAccordId, setCopiedAccordId] = useState<string | null>(null);

  const activeAccord = activeConversation
    ? VERIFIED_ACCORDS.find(a => a.id === activeConversation.id) ?? activeConversation
    : null;

  const handleDeclinePending = (index: number) => {
    setPendingIntroductions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAcceptPending = (pending: PendingIntroduction, index: number) => {
    const newAccord: Accord = {
      id: String(1100 + index),
      name: `Member ${index + 1}`,
      role: pending.role,
      intent: pending.intent,
      unread: true,
      status: "Pending Exchange",
      dispatch: "Танилцуулга хүлээн зөвшөөрөгдлөө. Анхны дипшч хэдхэн хормын дотор ирэх болно.",
      coordinates: null,
    };
    setVerifiedAccords(prev => [newAccord, ...prev]);
    setPendingIntroductions(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeclineAccord = () => {
    if (!activeAccord) return;
    setVerifiedAccords(prev => prev.filter(a => a.id !== activeAccord.id));
    setActiveConversation(null);
  };

  const handleAuthorizeExchange = () => {
    if (!activeAccord) return;
    setVerifiedAccords(prev => prev.map(a =>
      a.id === activeAccord.id
        ? { ...a, status: "Coordinates Exchanged", coordinates: a.coordinates ?? PLACEHOLDER_COORDINATES, unread: false }
        : a
    ));
  };

  const handleCopyCoordinates = async (accord: Accord) => {
    if (!accord.coordinates) return;
    try {
      await navigator.clipboard.writeText(accord.coordinates);
      setCopiedAccordId(accord.id);
      setTimeout(() => setCopiedAccordId(null), 2000);
    } catch {
      // ignore clipboard failures
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
      {activeAccord ? (
        <div className="w-full border border-accent-20 bg-[#0A0A0A] relative shadow-2xl flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="px-4 md:px-8 py-4 md:py-5 border-b border-accent-20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-[#070707] z-10 shrink-0">
            <div className="flex items-center gap-4 md:gap-6">
              <button onClick={() => setActiveConversation(null)} className="text-[10px] uppercase font-caps tracking-[0.2em] text-text-dim hover:text-white transition-colors flex items-center gap-2 group">
                <ArrowRight className="w-3 h-3 rotate-180 transform group-hover:-translate-x-1 transition-transform" />
                Буцах
              </button>
              <div className="w-[1px] h-6 bg-accent-20" />
              <div>
                <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase flex items-center gap-2">
                  {activeAccord.status === "Pending Exchange" ? (
                    <><div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Pending Exchange</>
                  ) : (
                    <><Check className="w-3 h-3 text-accent" /> Coordinates Authorized</>
                  )}
                </div>
                <div className="font-display text-xl text-text-main mt-1 tracking-tight">Member {activeAccord.id} // {activeAccord.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim uppercase border border-accent-20 px-2 py-1">
                Intent // {activeAccord.intent}
              </div>
            </div>
          </div>

          {/* Dispatch Area */}
          <div className="flex-1 p-5 md:p-12 flex flex-col justify-center">
            <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim/60 uppercase mb-6 flex items-center gap-4">
              Initial Dispatch
              <div className="h-[1px] flex-1 bg-gradient-to-r from-accent-20 to-transparent" />
            </div>

            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-text-main font-light italic mb-16 border-l-2 border-accent pl-6 lg:pl-10 relative">
              <span className="absolute -left-[3px] top-0 text-[60px] leading-none text-accent/20 font-serif">"</span>
              {activeAccord.dispatch}
            </p>

            {activeAccord.status === "Pending Exchange" ? (
              <div className="border border-accent-20 bg-bg-base/30 p-8 text-center flex flex-col items-center">
                <div className="font-caps text-[10px] tracking-[0.2em] text-accent/80 uppercase mb-4">Action Required</div>
                <p className="font-sans text-[12px] text-text-dim max-w-sm mb-6 leading-relaxed font-light">
                  Бид таны цагийг үнэлдэг. Noblr дээр эцэс төгсгөлгүй чатлах шаардлагагүй. Хэрвээ та уг хүсэлтийг зөвшөөрвөл хувийн холбоо барих мэдээллийг (Contact Coordinates) харилцан солилцож, амьд амьдрал дээр харилцаагаа үргэлжлүүлнэ үү.
                </p>
                <div className="flex gap-4">
                  <button onClick={handleDeclineAccord} className="bg-transparent border border-accent-20 text-text-dim px-8 py-3 font-caps text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors">
                    Decline
                  </button>
                  <button onClick={handleAuthorizeExchange} className="bg-text-main text-bg-base px-8 py-3 font-caps text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors flex items-center gap-3 group">
                    Authorize Coordinate Exchange
                    <Lock className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-accent p-8 relative overflow-hidden bg-accent/5">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Check className="w-24 h-24" />
                </div>
                <div className="font-caps text-[10px] tracking-[0.2em] text-accent uppercase mb-6 flex items-center gap-3">
                  <Lock className="w-4 h-4" /> Coordinates Authorized
                </div>

                <div className="bg-[#0A0A0A] border border-accent-20 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <pre className="font-mono text-[13px] md:text-[14px] text-text-main leading-loose whitespace-pre-wrap flex-1 min-w-0 break-all">
                    {activeAccord.coordinates}
                  </pre>
                  <button
                    onClick={() => handleCopyCoordinates(activeAccord)}
                    className="text-[10px] font-caps tracking-[0.2em] text-accent hover:text-white uppercase transition-colors px-4 py-2 border border-accent/30 hover:border-accent flex items-center justify-center gap-2 shrink-0"
                  >
                    {copiedAccordId === activeAccord.id ? <><Check className="w-3 h-3" /> Copied</> : 'Copy'}
                  </button>
                </div>

                <p className="font-sans text-[10px] tracking-[0.1em] text-text-dim uppercase mt-6 pt-4 border-t border-accent/20">
                  Please proceed via the secured channels above. Real connections happen in the real world.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-12 border-b border-accent-20 pb-8">
            <h2 className="font-display text-4xl font-light text-text-main mb-4 tracking-tight">The Anti-Chat Philosophy.</h2>
            <p className="font-serif italic text-text-dim text-[15px] leading-relaxed max-w-3xl">
              Noblr is not designed for endless scrolling, idle texting, or dopamine loops. We value your time.
              Introductions happen through a single, formal dispatch. If mutual interest is established, coordinates are exchanged,
              and the conversation operates strictly offline. Real connections happen in the real world.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Column 1: Verified Accords (Matches) */}
          <div>
            <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase mb-8 border-b border-accent-20 pb-4">
              Verified Introductions ({VERIFIED_ACCORDS.length})
            </div>
            <div className="flex flex-col gap-4">
              {VERIFIED_ACCORDS.map((accord, i) => (
                <button
                  key={i}
                  onClick={() => setActiveConversation(accord)}
                  className="w-full text-left group border border-accent-20 bg-bg-base/30 hover:bg-[#0E0C0A] transition-colors p-6 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-display text-2xl text-text-main tracking-tight group-hover:text-white transition-colors">{accord.name}</h4>
                      {accord.unread && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                    </div>
                    <div className="font-serif italic text-[14px] text-text-dim line-clamp-1">{accord.role}</div>
                    <div className="font-caps text-[8px] tracking-[0.2em] text-text-dim/60 uppercase mt-4">Intent: {accord.intent}</div>
                  </div>
                  <div className="font-caps text-[9px] tracking-[0.2em] text-accent uppercase border-b border-accent/30 group-hover:border-accent pb-1 transition-colors flex items-center gap-2 flex-shrink-0">
                    Direct Line <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Pending Inbound */}
          <div>
            <div className="font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase mb-8 border-b border-accent-20 pb-4">
              Pending Inbound ({PENDING_INTRODUCTIONS.length})
            </div>
            <div className="flex flex-col gap-4 opacity-70">
              {PENDING_INTRODUCTIONS.map((pending, i) => (
                <div key={i} className="w-full border border-accent-20 bg-bg-base/10 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 relative">
                      <h4 className="font-display text-2xl text-text-main/50 tracking-tight select-none">
                        <span className="blur-[4px]">Member X</span>
                      </h4>
                      <div className="font-sans text-[9px] tracking-[0.1em] text-text-dim uppercase">{pending.time}</div>
                    </div>
                    <div className="font-serif italic text-[14px] text-text-dim line-clamp-1 mb-4">
                      <span className="blur-[2px]">{pending.role}</span>
                    </div>
                    <div className="font-caps text-[8px] tracking-[0.2em] text-accent/60 uppercase">Intent: {pending.intent}</div>
                  </div>

                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-accent-20/50">
                    <button onClick={() => handleDeclinePending(i)} className="flex-1 text-[9px] font-caps tracking-[0.2em] text-text-dim hover:text-[#FF4A4A] uppercase transition-colors text-left">
                      Decline
                    </button>
                    <button onClick={() => handleAcceptPending(pending, i)} className="flex-1 text-[9px] font-caps tracking-[0.2em] text-accent hover:text-white uppercase transition-colors text-right">
                      Accept & Reveal
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 font-serif italic text-[13px] text-text-dim text-center">
              Pending requests remain anonymous to eliminate bias. Decisions cannot be reversed.
            </p>
          </div>
        </div>
        </div>
      )}
    </motion.div>
  );
}
