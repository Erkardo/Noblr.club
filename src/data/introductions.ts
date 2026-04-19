import type { Accord, PendingIntroduction } from '../types';

export const PENDING_INTRODUCTIONS: PendingIntroduction[] = [
  { id: "REDACTED", role: "Executive Board Member", intent: "Professional Network", time: "2 hrs ago" },
  { id: "REDACTED", role: "Contemporary Artist", intent: "Romantic Interest", time: "5 hrs ago" }
];

export const VERIFIED_ACCORDS: Accord[] = [
  {
    id: "1094",
    name: "Тэлмэн",
    role: "Venture Capitalist",
    intent: "Professional Network",
    unread: true,
    status: "Pending Exchange",
    dispatch: "Сайн байна уу, өчигдрийн арга хэмжээн дээрх таны үзэл бодол сонирхол татлаа. Технологийн салбар дахь хөрөнгө оруулалтын талаар кофе уунгаа ярилцах саналтай байна.",
    coordinates: null
  },
  {
    id: "0832",
    name: "Хулан",
    role: "Creative Director",
    intent: "Social Circle",
    unread: false,
    status: "Coordinates Exchanged",
    dispatch: "Art gallery-ийн curation маш их таалагдсан. Урлаг сонирхдог хүмүүсийн network-д нэгдэхэд таатай байх болно.",
    coordinates: "Telegram: @khulan_cd\nPhone: +976 9911-0832"
  }
];
