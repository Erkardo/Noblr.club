import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

/**
 * The anchoring engine. Three tiers, deliberately priced. The middle
 * tier (Inner Circle) is visually foregrounded so the brain defaults
 * there — making Member feel like the modest choice, not the cheap
 * choice. Concierge exists primarily to make Inner Circle look
 * reasonable by comparison.
 *
 * ₮ amounts are annual. No auto-renewal is a deliberate premium signal:
 * we are not chasing retention, members *reapply* to continue.
 */

interface Tier {
  key: string;
  name: string;
  price: string;
  priceSub: string;
  tag: string;
  description: string;
  features: string[];
  featured?: boolean;
  note?: string;
}

const TIERS: Tier[] = [
  {
    key: 'member',
    name: 'Member',
    price: '₮2,400,000',
    priceSub: '/ жил',
    tag: 'Basic',
    description: 'Noblr-ийн үндсэн эрх. Dossier болон Private Events.',
    features: [
      'Monday Dossier — долоо хоног бүр 6–9 гишүүн',
      'Private Events — улиралд ~4 уулзалт',
      'Introductions — сард 3 dispatch',
      'Member Directory нэвтрэх эрх',
    ],
  },
  {
    key: 'inner',
    name: 'Inner Circle',
    price: '₮4,800,000',
    priceSub: '/ жил',
    tag: 'Хамгийн сонгогдсон',
    description: 'Үндсэн гишүүнчлэл дээр хаалттай хүрээлэл болон приоритет.',
    features: [
      'Member бүх эрх',
      'Priority Rotation — Dossier-д эхлэх ээлж',
      'Founders\' Dinners — жилд 4 хаалттай уулзалт',
      'Phantom Mode — толгойгоо нуух эрх',
      'Quarterly retreat access',
      'Urgent dispatch (24 цаг)',
    ],
    featured: true,
  },
  {
    key: 'concierge',
    name: 'Concierge',
    price: '₮12,000,000',
    priceSub: '/ жил',
    tag: 'Ганцаарчилсан',
    description: 'Хувийн concierge. Гараар зохион байгуулсан танилцуулга.',
    features: [
      'Inner Circle бүх эрх',
      'Хувийн concierge — 24/7',
      'Гараар зохион байгуулсан танилцуулга',
      'Private itinerary — Улаанбаатар болон олон улсад',
      'Gallery + sommelier access',
      '+1 зочдын эрх',
    ],
    note: '· Жилд 12 суудал',
  },
];

export function PricingLadder({ onApply }: { onApply: () => void }) {
  return (
    <section
      aria-label="Membership pricing"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-5 md:px-6 relative z-10 border-t border-accent-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        className="text-center mb-14 md:mb-20"
      >
        <div className="font-caps text-[9px] tracking-[0.4em] text-accent uppercase mb-5">
          Гишүүнчлэл · Жилийн хураамж
        </div>
        <h2 className="font-display text-[38px] sm:text-[48px] md:text-[64px] font-light text-text-main leading-[1.02] tracking-[-0.02em]">
          Гурван түвшин. <span className="text-text-dim italic font-serif">Нэг л зарчим.</span>
        </h2>
        <p className="mt-7 font-serif italic text-[15px] text-text-dim max-w-xl mx-auto leading-[1.7]">
          Хураамж нь Noblr-ийн нууцлал, хаалттай байдал, чанарыг хадгалах үнэ.
          Автомат шинэчлэл байхгүй — жил бүр reapply хийнэ.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-accent-20 border border-accent-20">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className={`relative flex flex-col p-8 md:p-10 transition-colors ${
              tier.featured
                ? 'bg-gradient-to-b from-accent/10 via-accent/[0.03] to-transparent md:-my-4'
                : 'bg-bg-base'
            }`}
          >
            {tier.featured && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 font-caps text-[8px] tracking-[0.3em] text-bg-base bg-accent px-4 py-2 uppercase whitespace-nowrap">
                Inner Circle
              </div>
            )}

            <div className="font-caps text-[9px] tracking-[0.3em] text-accent uppercase mb-2">
              {tier.tag}
            </div>
            <h3 className="font-display italic text-text-main text-[30px] font-light tracking-tight leading-tight mb-4">
              {tier.name}
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display font-light text-text-main text-[36px] md:text-[40px] leading-none tracking-tight">
                {tier.price}
              </span>
              <span className="font-caps text-[10px] tracking-[0.2em] text-text-dim uppercase">
                {tier.priceSub}
              </span>
            </div>
            {tier.note && (
              <div className="font-caps text-[9px] tracking-[0.25em] text-accent/70 uppercase mb-3">
                {tier.note}
              </div>
            )}
            <p className="font-serif italic text-[13px] text-text-dim leading-relaxed mb-6 min-h-[48px]">
              {tier.description}
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 text-accent mt-1 shrink-0" />
                  <span className="font-sans text-[13px] text-text-main/85 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={onApply}
              className={`group w-full py-3.5 text-[10px] font-caps tracking-[0.25em] uppercase transition-colors flex items-center justify-center gap-3 ${
                tier.featured
                  ? 'bg-accent text-bg-base hover:bg-accent-deep'
                  : 'border border-accent-20 text-text-main hover:border-accent hover:text-accent'
              }`}
            >
              <span>Өргөдөл илгээх</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 font-caps text-[9px] tracking-[0.25em] text-text-dim/80 uppercase text-center">
        <span>Шалгаруулалтын хураамж ₮50,000 · Шалгараагүй тохиолдолд бүрэн буцаан олгогдоно</span>
        <span className="hidden md:inline opacity-40">·</span>
        <span>Гишүүнчлэл автоматаар сунгагдахгүй</span>
      </div>
    </section>
  );
}
