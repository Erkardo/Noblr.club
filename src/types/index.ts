export type View = 'landing' | 'apply' | 'waitlist' | 'login' | 'portal' | 'admin' | 'privacy' | 'terms';

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
}

export type InviteOutcome = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Invite {
  code: string;                            // NBLR-I-XXXXX
  issuedByMemberId: string;                // internal id ("8092")
  issuedByName: string;                    // display name
  issuedByMemberNumber: string;            // "No. 0247"
  issuedAt: number;                        // epoch ms
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
