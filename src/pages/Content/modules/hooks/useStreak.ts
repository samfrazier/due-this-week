import { useEffect, useState } from 'react';
import { LMSConfig } from '../types/config';
import { computeStreak, StreakResult } from '../utils/streak';

/* Loads past course work once and computes the streak locally.
   Returns null while loading, when turned off, or when this LMS
   doesn't support streaks yet. */
export default function useStreak(
  lms: LMSConfig,
  enabled: boolean
): StreakResult | null {
  const [streak, setStreak] = useState<StreakResult | null>(null);

  useEffect(() => {
    if (!enabled || !lms.loadStreakItems) {
      setStreak(null);
      return;
    }
    let cancelled = false;
    lms
      .loadStreakItems()
      .then((items) => {
        if (!cancelled) setStreak(computeStreak(items));
      })
      .catch(() => {
        if (!cancelled) setStreak(null); // never block the sidebar
      });
    return () => {
      cancelled = true;
    };
  }, [lms, enabled]);

  return streak;
}
