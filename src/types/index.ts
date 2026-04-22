export type View = 'landing' | 'apply' | 'waitlist' | 'login' | 'portal' | 'admin' | 'privacy' | 'terms' | 'about';

export type PortalTab = 'daily' | 'events' | 'introductions' | 'profile';

export type Intent = 'network' | 'social' | 'romance';

export interface Profile {
  id: string;
  name: string;
  age: number;
  role: string;
  company: string;
  image: string;
  description: string;
}

export interface PendingIntroduction {
  id: string;
  role: string;
  intent: string;
  time: string;
}

export type AccordStatus = 'Pending Exchange' | 'Coordinates Exchanged';

export interface Accord {
  id: string;
  name: string;
  role: string;
  intent: string;
  unread: boolean;
  status: AccordStatus;
  dispatch: string;
  coordinates: string | null;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  image: string;
  status: string;
  capacity: string;
  filled: string;
  action: string;
  urgency: string;
}

export interface PastEvent {
  id: string;
  title: string;
  desc: string;
  date: string;
}

export interface PressEntry {
  logo: string;
  quote: string;
  image: string;
  font: string;
}

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Application {
  id: string;
  name: string;
  age: number;
  company: string;
  position: string;
  status: ApplicationStatus;
  date: string;
  intentStatement?: string;
  linkedin?: string;
  inviteCode?: string;          // if sponsored
  sponsorMemberNumber?: string; // e.g. "No. 0247"
  sponsorName?: string;
  // extended screening fields
  birthday?: string;             // ISO YYYY-MM-DD
  gender?: 'male' | 'female';
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  experience?: string;          // '3-5' | '5-10' | '10-15' | '15+'
  education?: string;
  influences?: string;           // reflective essay
  depositAccepted?: boolean;
  // Issued at the moment of Committee approval. Persisted on the application
  // so a visitor returning to Waitlist can see what was sent and, if needed,
  // the Committee can resend. `emailSentAt` is null if sending failed.
  memberNumber?: string;         // "No. 0249"
  dispatchCode?: string;         // "NBLR-0249"
  dispatchKey?: string;          // short welcome key, 6+ chars
  emailSentAt?: number | null;   // epoch ms, or null if send failed
  emailError?: string;           // last error message, if any
}

export type InviteOutcome = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Invite {
  code: string;                            // NBLR-I-XXXXX
  issuedByMemberId: string;                // internal id ("8092")
  issuedByName: string;                    // display name
  issuedByMemberNumber: string;            // "No. 0247"
  issuedAt: number;                        // epoch ms
  expiresAt?: number;                      // epoch ms — 30 days after issuedAt
  claimedByApplicationId: string | null;
  claimedAt: number | null;
  outcome: InviteOutcome;
}

export interface CurrentMember {
  id: string;
  name: string;
  memberNumber: string;
  role: string;
  invitesRemaining: number;   // starts at 3, capped at 5
  invitesEverIssued: number;
  patronSince: number | null; // epoch ms once crossing 3 successful sponsorships
}

export interface ActiveIntents {
  network: boolean;
  social: boolean;
  romance: boolean;
}

export interface OutboundRequest {
  profileId: string;
  intent: Intent;
  sentAt: number;
}

/**
 * Auto-saved application draft. Lives in localStorage (per-device, not
 * synced). We only persist what the visitor has typed — no derived
 * state, no errors, no step validation. On mount of ApplicationView
 * we rehydrate into local form state and, on successful submission,
 * clear it.
 */
export interface ApplicationDraft {
  step: number;                // 1..4
  updatedAt: number;           // epoch ms
  form: {
    name?: string;
    birthday?: string;
    gender?: 'male' | 'female' | '';
    phone?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    position?: string;
    company?: string;
    experience?: '3-5' | '5-10' | '10-15' | '15+' | '';
    education?: string;
    intent?: 'network' | 'social' | 'romance' | '';
    motivation?: string;
    influences?: string;
    depositAccepted?: boolean;
  };
}
