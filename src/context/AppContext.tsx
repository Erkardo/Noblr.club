import { createContext, useContext, useState, useMemo, ReactNode, Dispatch, SetStateAction } from 'react';
import type {
  Accord,
  ActiveIntents,
  Application,
  OutboundRequest,
  PendingIntroduction,
  View,
} from '../types';
import { useSupabaseState } from '../hooks/useSupabaseState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MOCK_APPLICATIONS } from '../data/applications';
import { PENDING_INTRODUCTIONS, VERIFIED_ACCORDS } from '../data/introductions';

interface AppContextValue {
  view: View;
  setView: Dispatch<SetStateAction<View>>;

  applications: Application[];
  setApplications: Dispatch<SetStateAction<Application[]>>;

  pendingIntroductions: PendingIntroduction[];
  setPendingIntroductions: Dispatch<SetStateAction<PendingIntroduction[]>>;

  verifiedAccords: Accord[];
  setVerifiedAccords: Dispatch<SetStateAction<Accord[]>>;

  phantomMode: boolean;
  setPhantomMode: Dispatch<SetStateAction<boolean>>;

  activeIntents: ActiveIntents;
  setActiveIntents: Dispatch<SetStateAction<ActiveIntents>>;

  dispatchTemplate: string;
  setDispatchTemplate: Dispatch<SetStateAction<string>>;

  bookedEventIds: string[];
  setBookedEventIds: Dispatch<SetStateAction<string[]>>;

  eventFilledOverrides: Record<string, number>;
  setEventFilledOverrides: Dispatch<SetStateAction<Record<string, number>>>;

  outboundRequests: OutboundRequest[];
  setOutboundRequests: Dispatch<SetStateAction<OutboundRequest[]>>;

  archivedProfileIds: string[];
  setArchivedProfileIds: Dispatch<SetStateAction<string[]>>;

  // Personal (per-device) — not synced across users.
  lastApplicationId: string | null;
  setLastApplicationId: Dispatch<SetStateAction<string | null>>;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_DISPATCH = "Сайн байна уу, таны профайл дээрх үзэл бодол сонирхол татлаа. Удахгүй болох арга хэмжээнүүдийн нэг дээр уулзаж ярилцах саналтай байна.";
const DEFAULT_INTENTS: ActiveIntents = { network: true, social: true, romance: false };

export function AppProvider({ children }: { children: ReactNode }) {
  // view is ephemeral — user always starts on landing on reload
  const [view, setView] = useState<View>('landing');

  const [applications, setApplications] = useSupabaseState<Application[]>('applications', MOCK_APPLICATIONS);
  const [pendingIntroductions, setPendingIntroductions] = useSupabaseState<PendingIntroduction[]>('pendingIntroductions', PENDING_INTRODUCTIONS);
  const [verifiedAccords, setVerifiedAccords] = useSupabaseState<Accord[]>('verifiedAccords', VERIFIED_ACCORDS);

  const [phantomMode, setPhantomMode] = useSupabaseState<boolean>('phantomMode', false);
  const [activeIntents, setActiveIntents] = useSupabaseState<ActiveIntents>('activeIntents', DEFAULT_INTENTS);
  const [dispatchTemplate, setDispatchTemplate] = useSupabaseState<string>('dispatchTemplate', DEFAULT_DISPATCH);

  const [bookedEventIds, setBookedEventIds] = useSupabaseState<string[]>('bookedEventIds', []);
  const [eventFilledOverrides, setEventFilledOverrides] = useSupabaseState<Record<string, number>>('eventFilledOverrides', {});
  const [outboundRequests, setOutboundRequests] = useSupabaseState<OutboundRequest[]>('outboundRequests', []);
  const [archivedProfileIds, setArchivedProfileIds] = useSupabaseState<string[]>('archivedProfileIds', []);

  // Per-device: last application ID the user submitted from this browser
  const [lastApplicationId, setLastApplicationId] = useLocalStorage<string | null>('noblr:lastApplicationId', null);

  const resetDemoData = () => {
    setApplications(MOCK_APPLICATIONS);
    setPendingIntroductions(PENDING_INTRODUCTIONS);
    setVerifiedAccords(VERIFIED_ACCORDS);
    setPhantomMode(false);
    setActiveIntents(DEFAULT_INTENTS);
    setDispatchTemplate(DEFAULT_DISPATCH);
    setBookedEventIds([]);
    setEventFilledOverrides({});
    setOutboundRequests([]);
    setArchivedProfileIds([]);
  };

  const value = useMemo<AppContextValue>(() => ({
    view, setView,
    applications, setApplications,
    pendingIntroductions, setPendingIntroductions,
    verifiedAccords, setVerifiedAccords,
    phantomMode, setPhantomMode,
    activeIntents, setActiveIntents,
    dispatchTemplate, setDispatchTemplate,
    bookedEventIds, setBookedEventIds,
    eventFilledOverrides, setEventFilledOverrides,
    outboundRequests, setOutboundRequests,
    archivedProfileIds, setArchivedProfileIds,
    lastApplicationId, setLastApplicationId,
    resetDemoData,
  }), [
    view,
    applications,
    pendingIntroductions,
    verifiedAccords,
    phantomMode,
    activeIntents,
    dispatchTemplate,
    bookedEventIds,
    eventFilledOverrides,
    outboundRequests,
    archivedProfileIds,
    lastApplicationId,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
