import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

/**
 * The reciprocity engine. We give something of value before asking for
 * anything — a quarterly intelligence brief curated from member
 * interviews. A visitor who accepts the brief has taken a small
 * commitment toward Noblr's worldview, and is statistically far more
 * likely to escalate to an application.
 *
 * Technically the "delivery" here is a demo: we capture the email to
 * localStorage and show confirmation. In production this wires to an
 * email system.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface BriefSubscription {
  email: string;
  subscribedAt: number;
}

export function QuarterlyBrief() {
  const [subscription, setSubscription] = useLocalStorage<BriefSubscription | null>(
    'noblr:briefSubscription',
    null,
  );
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Имэйл форматтай биш.');
      return;
    }
    setSubmitting(true);
    // Slight pause for the theatrical confirm. 600ms feels like *actually*
    // dispatching, not like a client-side toggle.
    setTimeout(() => {
      setSubscription({ email: trimmed, subscribedAt: Date.now() });
      setSubmitting(false);
    }, 700);
  };

  return (
    <section
      aria-label="Noblr Quarterly Brief"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-5 md:px-6 relative z-10 border-t border-accent-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left — headline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          className="lg:col-span-6"
        >
          <div className="font-caps text-[9px] tracking-[0.4em] text-text-main uppercase mb-5">
            Noblr Brief · Quarterly
          </div>
          <h2 className="font-display text-[38px] sm:text-[48px] md:text-[60px] font-light text-text-main leading-[1.02] tracking-[-0.02em] mb-7">
            Өөр хаанаас ч<br/>
            <span className="text-text-dim italic font-serif">сонсож чадахгүй.</span>
          </h2>
          <p className="font-serif italic text-text-dim text-[15px] md:text-[16px] leading-[1.7] max-w-md mb-8">
            Монголын шилдэг удирдагчдын загвар, сэтгэлгээ, завсарлага.
            24 хуудас. Улирал бүрт. Хэвлэлд орохгүй.
          </p>

          <ul className="space-y-3">
            {[
              '14 гишүүний ярилцлага нэг дугаарт',
              'Зах зээл болон соёлын анализ',
              'Гишүүдийн unpublished ном болон эх сурвалж',
              'Бүрэн нууцлал · Захиалгагүй',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-3.5 h-3.5 text-text-main mt-1 shrink-0" />
                <span className="font-sans text-[13px] text-text-main/80 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — brief card + subscribe */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.1 }}
          className="lg:col-span-6"
        >
          <div className="border border-accent-20 bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent p-8 md:p-10">
            {/* Brief cover — editorial mock with atmospheric photo backdrop.
                Aspect 5:7 evokes a printed magazine portrait cover. */}
            <div
              className="aspect-[5/7] relative flex flex-col justify-between mb-8 p-7 md:p-9 text-bg-base overflow-hidden border border-text-main/20"
              style={{
                backgroundImage: `linear-gradient(rgba(26,22,18,0.55), rgba(26,22,18,0.85)), url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="font-caps text-[8px] tracking-[0.4em] uppercase" style={{ color: '#D9B8B6' }}>
                  Noblr Private Brief
                </div>
                <div className="font-caps text-[8px] tracking-[0.3em] uppercase text-bg-base/70">
                  Spring 2026
                </div>
              </div>

              <div>
                <div className="font-caps text-[8px] tracking-[0.4em] uppercase mb-3" style={{ color: '#D9B8B6' }}>
                  Issue 14 · Cover Story
                </div>
                <div className="font-display italic text-bg-base text-[24px] md:text-[28px] font-light leading-[1.1] mb-4">
                  Монголын цахим эдийн засгийн шинэ үе.
                </div>
                <div className="font-serif italic text-bg-base/80 text-[12px] leading-relaxed">
                  14 гишүүний нэр сэтгэлгээ · 24 хуудас<br/>
                  Editorial: The Noblr Committee
                </div>
              </div>
            </div>

            {subscription ? (
              <div className="flex items-start gap-3 p-4 border border-accent/40 bg-accent/5">
                <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                <div>
                  <div className="font-caps text-[10px] tracking-[0.25em] text-accent uppercase mb-1">
                    Хүлээн авна
                  </div>
                  <p className="font-serif italic text-[13px] text-text-dim leading-relaxed">
                    Spring 2026 дугаар <span className="text-text-main">{subscription.email}</span>{' '}
                    хаягаар 48 цагийн дотор ирнэ. Spam биш — White list хийхээ бүү мартаарай.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block font-caps text-[9px] tracking-[0.3em] text-text-dim uppercase">
                  Имэйл хаяг
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="name@domain.com"
                    required
                    className="flex-1 px-4 py-3.5 text-[14px] text-text-main placeholder-text-dim/30 font-sans font-light bg-transparent border border-accent-20 focus:border-accent outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group bg-accent text-bg-base px-6 py-3.5 text-[10px] font-caps tracking-[0.25em] uppercase hover:bg-accent-deep transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <span>{submitting ? 'Илгээж байна' : 'Хүлээн авах'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                {error && <div className="font-sans text-[11px] text-error">{error}</div>}
                <p className="font-caps text-[8px] tracking-[0.25em] text-text-dim/70 uppercase mt-4">
                  Үнэгүй · Захиалга цуцлах шаардлагагүй · Хэнд ч дамжуулахгүй
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
