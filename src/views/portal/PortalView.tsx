import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Compass, Calendar, Inbox, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { DailySelectionTab } from './DailySelectionTab';
import { PrivateEventsTab } from './PrivateEventsTab';
import { IntroductionsTab } from './IntroductionsTab';
import { MyProfileTab } from './MyProfileTab';
import type { PortalTab } from '../../types';

export function PortalView() {
  const { pendingIntroductions: PENDING_INTRODUCTIONS, verifiedAccords: VERIFIED_ACCORDS } = useAppContext();
  const [activeTab, setActiveTab] = useState<PortalTab>('daily');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex-1 flex flex-col w-full max-w-5xl mx-auto py-6 md:py-8 px-4 md:px-8 mt-6 md:mt-12 mb-24 md:mb-0 z-20"
    >
      {/* Desktop Tabs */}
      <div className="hidden md:flex border-b border-accent-20 mb-12 overflow-x-auto hide-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('daily')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'daily' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          Daily Selection
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'events' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          Private Events
        </button>
        <button
          onClick={() => setActiveTab('introductions')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'introductions' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          Introductions
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`font-caps text-[10px] tracking-[0.2em] uppercase pb-4 px-6 transition-colors border-b-2 ${activeTab === 'profile' ? 'text-text-main border-accent' : 'text-text-dim border-transparent hover:text-text-main'}`}
        >
          My Profile
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#070707]/90 backdrop-blur-xl border-t border-accent-20 z-50 flex justify-around items-center px-2 py-4 pb-safe-offset-4">
        <button onClick={() => setActiveTab('daily')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'daily' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <Compass className={`w-5 h-5 ${activeTab === 'daily' ? 'text-accent' : ''}`} />
          <span className="text-[7px] font-caps uppercase tracking-widest">Dossier</span>
        </button>
        <button onClick={() => setActiveTab('events')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'events' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <Calendar className={`w-5 h-5 ${activeTab === 'events' ? 'text-accent' : ''}`} />
          <span className="text-[7px] font-caps uppercase tracking-widest">Events</span>
        </button>
        <button onClick={() => setActiveTab('introductions')} className={`flex flex-col items-center gap-1.5 transition-colors relative ${activeTab === 'introductions' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <Inbox className={`w-5 h-5 ${activeTab === 'introductions' ? 'text-accent' : ''}`} />
          {(VERIFIED_ACCORDS.some(a => a.unread) || PENDING_INTRODUCTIONS.length > 0) && (
            <div className="absolute -top-0.5 right-[15%] w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          )}
          <span className="text-[7px] font-caps uppercase tracking-widest">Inbound</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-text-main' : 'text-text-dim/60'}`}>
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-accent' : ''}`} />
          <span className="text-[7px] font-caps uppercase tracking-widest">Profile</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'daily' && <DailySelectionTab key="daily" />}
        {activeTab === 'events' && <PrivateEventsTab key="events" />}
        {activeTab === 'introductions' && <IntroductionsTab key="introductions" />}
        {activeTab === 'profile' && <MyProfileTab key="profile" />}
      </AnimatePresence>
    </motion.div>
  );
}
