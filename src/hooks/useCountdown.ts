import { useEffect, useState } from 'react';
import { diffToParts, type TimeLeft } from '../lib/dropWindow';

/**
 * Tick every second toward a target timestamp. Pauses when the tab is
 * hidden — running setInterval in a background tab is a well-known
 * battery waste on laptops and mobile.
 */
export function useCountdown(target: Date): TimeLeft {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id !== null) return;
      id = setInterval(() => setNow(Date.now()), 1000);
    };
    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        setNow(Date.now());
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return diffToParts(target.getTime(), now);
}
