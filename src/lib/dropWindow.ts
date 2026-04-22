import type { Application } from '../types';

/**
 * Noblr accepts applications in quarterly drops. Each drop closes at the
 * final minute of a calendar quarter (Ulaanbaatar time, UTC+8). The
 * countdown on Landing is what translates "apply when you feel ready"
 * into "apply before the door shuts."
 *
 * If you're reading this because you want to shift the cadence — just
 * adjust the month list. Everything downstream (label, countdown, copy)
 * derives from this function.
 */
export function getNextDropClose(now: Date = new Date()): Date {
  const year = now.getFullYear();
  const candidates = [
    new Date(`${year}-03-31T23:59:59+08:00`),
    new Date(`${year}-06-30T23:59:59+08:00`),
    new Date(`${year}-09-30T23:59:59+08:00`),
    new Date(`${year}-12-31T23:59:59+08:00`),
  ];
  for (const c of candidates) {
    if (c.getTime() > now.getTime()) return c;
  }
  return new Date(`${year + 1}-03-31T23:59:59+08:00`);
}

/** Season label keyed to the close month. Displayed next to the countdown. */
export function getDropName(close: Date): string {
  const m = close.getMonth(); // 0-indexed
  const y = close.getFullYear();
  if (m <= 2) return `Winter ${y}`;
  if (m <= 5) return `Spring ${y}`;
  if (m <= 8) return `Summer ${y}`;
  return `Autumn ${y}`;
}

/** Drop after the current one — for "Next window opens" subcopy. */
export function getFollowingDropOpen(close: Date): Date {
  // The following drop opens the day after the current one closes.
  const next = new Date(close.getTime() + 24 * 60 * 60 * 1000);
  next.setUTCHours(0, 0, 0, 0);
  return next;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function diffToParts(targetMs: number, now: number = Date.now()): TimeLeft {
  const totalMs = Math.max(0, targetMs - now);
  const seconds = Math.floor(totalMs / 1000) % 60;
  const minutes = Math.floor(totalMs / (1000 * 60)) % 60;
  const hours = Math.floor(totalMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, totalMs };
}

export interface AcceptanceStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  rate: number; // percent, rounded
}

/**
 * Live acceptance metrics for this quarter. We don't filter by date
 * window because the demo dataset is small — in a real build this
 * would take a cutoff. For now, "applications received" is the whole
 * dataset.
 */
export function getAcceptanceStats(applications: Application[]): AcceptanceStats {
  const total = applications.length;
  const approved = applications.filter(a => a.status === 'APPROVED').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;
  const pending = applications.filter(a => a.status === 'PENDING').length;
  const decided = approved + rejected;
  const rate = decided > 0 ? Math.round((approved / decided) * 100) : 13;
  return { total, approved, rejected, pending, rate };
}
