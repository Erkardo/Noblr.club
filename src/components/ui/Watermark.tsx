import { useAppContext } from '../../context/AppContext';

/**
 * Subtle member-number watermark across the Portal surface. Discourages
 * screenshot leakage by tying each captured image to the identity
 * viewing it. Non-functional for determined actors but a social signal
 * that this content is personalized and traceable.
 */
export function Watermark() {
  const { currentMember } = useAppContext();
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const text = `${currentMember.memberNumber} · ${timestamp}`;

  // Render the text repeated across the viewport at a subtle opacity.
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[40] overflow-hidden select-none mix-blend-overlay"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -35deg,
          transparent 0,
          transparent 120px,
          rgba(239, 233, 218, 0.02) 120px,
          rgba(239, 233, 218, 0.02) 121px
        )`,
      }}
    >
      <div className="absolute inset-0 flex flex-wrap content-start items-start gap-x-24 gap-y-24 p-8 opacity-[0.035]">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="font-caps text-[10px] tracking-[0.3em] text-text-main uppercase whitespace-nowrap"
            style={{ transform: 'rotate(-28deg)' }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
