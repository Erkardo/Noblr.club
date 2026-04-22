/**
 * The outsider-visible teaser of this week's Monday Dossier. Non-members
 * see a redacted silhouette — a role, an age bracket, a single evocative
 * teaser sentence. Member number is partially masked. The point is to
 * plant curiosity: *who is that?* — not to reveal anything.
 *
 * This roster is deliberately hand-curated, not pulled from any real
 * applicant or member. Rotating it quarterly is fine; don't tie it to
 * live data.
 */

export interface DossierCard {
  maskedNumber: string;   // e.g. "No. 00██"
  role: string;           // visible
  ageRange: string;       // e.g. "32–34"
  teaser: string;         // one sentence, partially censored with ┃┃┃┃┃
  tag: 'The Network' | 'The Circle' | 'The Romance';
  revealed?: boolean;     // one card shown in full as a taste
}

export const DOSSIER_ROSTER_THIS_WEEK: DossierCard[] = [
  {
    maskedNumber: 'No. 03██',
    role: 'Strategic Advisor',
    ageRange: '34',
    teaser: 'Найман жилийн дараа ┃┃┃┃┃-гаас Улаанбаатарт буцан ирсэн. Одоо ┃┃┃┃┃┃┃ төсөл дээр ажиллаж байна.',
    tag: 'The Network',
    revealed: true,
  },
  {
    maskedNumber: 'No. 02██',
    role: 'Founder · Quiet Practice',
    ageRange: '31',
    teaser: 'Гурван улсад бутикийн сургалтын хөтөлбөрөө ┃┃┃┃┃┃. Энэ улиралд ┃┃┃┃┃ хотод нээх төлөвлөгөөтэй.',
    tag: 'The Network',
  },
  {
    maskedNumber: 'No. 04██',
    role: 'Principal, Early-Stage Capital',
    ageRange: '38',
    teaser: 'Монголын ┃┃┃┃┃┃┃ ангилалд анхдагч хөрөнгө оруулалт хийж эхэлсэн. Долоо хоногт ┃ уулзалт хийнэ.',
    tag: 'The Network',
  },
  {
    maskedNumber: 'No. 01██',
    role: 'Художник · Curator',
    ageRange: '29',
    teaser: 'Tate Modern дээр үзэсгэлэнтэй ┃┃┃┃┃. Хичээнгүй хоббигаас гадна ┃┃┃┃┃┃-ыг эрхэлдэг.',
    tag: 'The Circle',
  },
  {
    maskedNumber: 'No. 03██',
    role: 'Physician-Researcher',
    ageRange: '36',
    teaser: 'Мэс засал + биотехнологи. Одоогоор ┃┃┃┃┃┃-ийн clinical trial-ийг Монголд ┃┃┃┃┃┃.',
    tag: 'The Circle',
  },
  {
    maskedNumber: 'No. 02██',
    role: 'Managing Partner',
    ageRange: '33',
    teaser: 'Хуулийн фирмийн хамтран эзэмшигч. Номын сан, зохиол, хөгжим ┃┃┃┃ сонирхдог. Сүүлд ┃┃┃┃┃ харсан.',
    tag: 'The Romance',
  },
];
