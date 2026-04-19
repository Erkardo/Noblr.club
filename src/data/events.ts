import type { PastEvent, UpcomingEvent } from '../types';

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "E-094",
    title: "Tasting & Contemporary Art",
    desc: "A closed-door evening examining neo-expressionist works, paired with curated vintages. Confidential attendance.",
    date: "Nov 24, 2026",
    location: "Location sent 24h prior via encrypted channel",
    image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=1200",
    status: "Waitlist Only",
    capacity: "14",
    filled: "14",
    action: "Join Waitlist",
    urgency: "Allocation exhausted."
  },
  {
    id: "E-102",
    title: "Founders' Discourse",
    desc: "An intimate dialogue on macro-economics and frontier markets. Reserved for Tier-I members and strategic partners.",
    date: "Dec 02, 2026",
    location: "Private Residence, Bogd Khan Mountain",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200",
    status: "By Approval",
    capacity: "8",
    filled: "5",
    action: "Request Seat",
    urgency: "3 seats remain. Closes in 48 hours."
  }
];

export const PAST_EVENTS: PastEvent[] = [
  {
    id: "A-089",
    title: "Midnight Symphony & Cigars",
    desc: "A closed-door performance by a visiting state string quartet, accompanied by rare 1990 Cuban reserves. 10 minds gathered. Only memories remain.",
    date: "Oct 12, 2026",
  },
  {
    id: "A-073",
    title: "The Autumn Equinox Retreat",
    desc: "A two-day secluded dialogue between unicorn founders and frontier tech investors. Paired with Michelin-level private dining. What was said there, stays there.",
    date: "Sep 22, 2026",
  }
];
