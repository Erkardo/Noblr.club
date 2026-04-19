import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { LandingView } from './views/LandingView';
import { ApplicationView } from './views/ApplicationView';
import { WaitlistView } from './views/WaitlistView';
import { LoginView } from './views/LoginView';
import { AdminView } from './views/AdminView';
import { PortalView } from './views/portal/PortalView';
import { AppProvider, useAppContext } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { view, setView, pendingIntroductions, verifiedAccords } = useAppContext();
  const hasUnread = pendingIntroductions.length > 0 || verifiedAccords.some(a => a.unread);

  // Simple smooth scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-bg-base font-sans text-text-main relative overflow-hidden flex flex-col p-[20px]">
      <div className="absolute inset-[20px] pointer-events-none border border-accent-20 z-0" />
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-20 opacity-20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar Minimal */}
      <header className="relative z-20 w-full px-6 md:px-8 py-6 md:py-10 flex justify-between items-center mix-blend-difference">
        <button
          onClick={() => view !== 'landing' && setView('landing')}
          disabled={view === 'landing'}
          className="flex items-center gap-3 group"
          aria-label="Noblr"
        >
          <span className="text-text-main font-display text-[22px] tracking-[-0.005em] font-light leading-none pt-1 group-hover:tracking-[0.005em] transition-[letter-spacing] duration-500">Noblr</span>
          <span className="hidden md:block h-[14px] w-px bg-accent-20 group-hover:bg-accent transition-colors duration-500" />
        </button>
        {view === 'landing' && (
          <nav className="flex gap-8 items-center">
            <button
              onClick={() => setView('login')}
              className="font-caps text-[11px] tracking-[0.2em] text-text-dim hover:text-text-main transition-colors uppercase flex items-center gap-2 group"
            >
              Member Login
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          </nav>
        )}
        {(view === 'apply' || view === 'waitlist' || view === 'login' || view === 'admin') && (
          <button
            onClick={() => setView('landing')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-dim hover:text-text-main border border-transparent hover:border-accent-20 transition-all duration-300"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {view === 'portal' && (
          <button
            onClick={() => setView('landing')}
            className="relative font-caps text-[10px] tracking-[0.2em] text-text-dim hover:text-text-main transition-colors uppercase border-b border-accent-20 pb-0.5"
          >
            Log Out
            {hasUnread && (
              <span className="absolute -top-1 -right-3 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-label="Unread notifications" />
            )}
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col relative z-10 isolate overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence mode="wait">
          {view === 'landing' && <LandingView key="landing" onApply={() => setView('apply')} onAdmin={() => setView('admin')} />}
          {view === 'apply' && <ApplicationView key="apply" onComplete={() => setView('waitlist')} />}
          {view === 'waitlist' && <WaitlistView key="waitlist" />}
          {view === 'login' && <LoginView key="login" onLogin={() => setView('portal')} />}
          {view === 'portal' && <PortalView key="portal" />}
          {view === 'admin' && <AdminView key="admin" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
