/**
 * @file Ticking clock hook for live timers.
 */

import { useEffect, useState } from 'react';

/**
 * Current time, refreshed on an interval while `active` is true.
 *
 * @param {number} [intervalMs] Refresh interval.
 * @param {boolean} [active]    Stop ticking when false (e.g. once an incident is resolved).
 * @returns {number} Epoch milliseconds.
 */
export function useNow(intervalMs = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, active]);

  return now;
}
