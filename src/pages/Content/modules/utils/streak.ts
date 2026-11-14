/*
  Streak: how many days in a row the student hasn't missed an assignment.

  Rules (agreed for v1.1):
  - Count calendar days, in the user's local time zone.
  - Days with nothing due keep the streak going.
  - Only a "missing" assignment breaks it. Late but submitted is fine.
  - Excused items, and items the student marked complete, never break it.
  - Custom tasks (planner notes) never break it; only real course work counts.
  - Look back about one semester (STREAK_LOOKBACK_DAYS). If nothing was missed
    in that window, show "120+ days".
  - Everything is computed in the browser; nothing is sent anywhere.
*/

export const STREAK_LOOKBACK_DAYS = 120;

export interface StreakItem {
  due_at: string; // ISO date
  missing: boolean; // the LMS says it's missing (past due, not submitted)
  excused: boolean;
  marked_complete: boolean; // checked off in the sidebar or the Canvas planner
  is_custom: boolean; // a custom task / planner note
}

export interface StreakResult {
  days: number; // 0 means no current streak
  capped: boolean; // true when nothing was missed in the whole lookback window
  since?: Date; // first day of the current streak (when not capped)
}

const DAY_MS = 24 * 3600 * 1000;

function startOfDay(d: Date): Date {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
}

function daysBetween(earlier: Date, later: Date): number {
  return Math.round(
    (startOfDay(later).getTime() - startOfDay(earlier).getTime()) / DAY_MS
  );
}

export function breaksStreak(item: StreakItem): boolean {
  return (
    item.missing && !item.excused && !item.marked_complete && !item.is_custom
  );
}

export function computeStreak(
  items: StreakItem[],
  now: Date = new Date(Date.now()),
  lookbackDays = STREAK_LOOKBACK_DAYS
): StreakResult {
  const windowStart = startOfDay(now);
  windowStart.setDate(windowStart.getDate() - lookbackDays);

  let lastMiss: Date | undefined;
  let anyCourseWork = false;
  items.forEach((item) => {
    const due = new Date(item.due_at);
    if (isNaN(due.valueOf()) || due < windowStart || due > now) return;
    if (!item.is_custom) anyCourseWork = true;
    if (breaksStreak(item) && (!lastMiss || due > lastMiss)) lastMiss = due;
  });

  // nothing to judge yet (new student, or no course work in the window)
  if (!anyCourseWork) return { days: 0, capped: false };

  if (!lastMiss) return { days: lookbackDays, capped: true };

  const days = daysBetween(lastMiss, now);
  if (days <= 0) return { days: 0, capped: false };
  const since = startOfDay(lastMiss);
  since.setDate(since.getDate() + 1);
  return { days, capped: false, since };
}

export interface DueTodayItem {
  due_at: string;
  done: boolean;
  is_custom: boolean;
  needs_grading?: boolean;
}

/* Unfinished course work due later today: the "finish them to keep it going" warning. */
export function countDueToday(
  items: DueTodayItem[],
  now: Date = new Date(Date.now())
): number {
  return items.filter((item) => {
    if (item.done || item.is_custom || item.needs_grading) return false;
    const due = new Date(item.due_at);
    return daysBetween(now, due) === 0 && due >= now;
  }).length;
}
