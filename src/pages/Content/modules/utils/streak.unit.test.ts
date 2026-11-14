import {
  computeStreak,
  countDueToday,
  StreakItem,
  STREAK_LOOKBACK_DAYS,
} from './streak';

// Thursday Nov 12 2026, 3pm local time
const NOW = new Date(2026, 10, 12, 15, 0, 0);

function daysAgo(n: number, hour = 23, minute = 59): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function item(dueDaysAgo: number, over: Partial<StreakItem> = {}): StreakItem {
  return {
    due_at: daysAgo(dueDaysAgo),
    missing: false,
    excused: false,
    marked_complete: false,
    is_custom: false,
    ...over,
  };
}

describe('computeStreak', () => {
  test('counts days since the last missed assignment', () => {
    const r = computeStreak(
      [item(30), item(12, { missing: true }), item(5)],
      NOW
    );
    expect(r.days).toBe(12);
    expect(r.capped).toBe(false);
    expect(r.since).toEqual(new Date(2026, 10, 1)); // missed Oct 31, streak starts Nov 1
  });

  test('the most recent miss wins', () => {
    const r = computeStreak(
      [
        item(40, { missing: true }),
        item(3, { missing: true }),
        item(20, { missing: true }),
      ],
      NOW
    );
    expect(r.days).toBe(3);
  });

  test('days with nothing due keep the streak going', () => {
    // one miss long ago, then nothing at all due for weeks
    expect(computeStreak([item(25, { missing: true })], NOW).days).toBe(25);
  });

  test('late but submitted does not break it (only missing does)', () => {
    // Canvas reports late submissions as late, not missing
    const r = computeStreak([item(2), item(60, { missing: true })], NOW);
    expect(r.days).toBe(60);
  });

  test('excused items do not break it', () => {
    const r = computeStreak(
      [item(4, { missing: true, excused: true }), item(50, { missing: true })],
      NOW
    );
    expect(r.days).toBe(50);
  });

  test('items marked complete do not break it', () => {
    const r = computeStreak(
      [
        item(4, { missing: true, marked_complete: true }),
        item(9, { missing: true }),
      ],
      NOW
    );
    expect(r.days).toBe(9);
  });

  test('custom tasks never break it', () => {
    const r = computeStreak(
      [item(1, { missing: true, is_custom: true }), item(7, { missing: true })],
      NOW
    );
    expect(r.days).toBe(7);
  });

  test('nothing missed in the window shows the capped "120+" streak', () => {
    const r = computeStreak([item(10), item(80)], NOW);
    expect(r).toEqual({ days: STREAK_LOOKBACK_DAYS, capped: true });
  });

  test('misses older than the lookback window are ignored', () => {
    const r = computeStreak(
      [item(5), item(STREAK_LOOKBACK_DAYS + 5, { missing: true })],
      NOW
    );
    expect(r.capped).toBe(true);
  });

  test('a miss earlier today means no streak yet', () => {
    const r = computeStreak(
      [{ ...item(0), due_at: daysAgo(0, 9, 0), missing: true }],
      NOW
    );
    expect(r.days).toBe(0);
  });

  test('a miss yesterday makes today day 1', () => {
    expect(computeStreak([item(1, { missing: true })], NOW).days).toBe(1);
  });

  test('no course work at all means no streak to show', () => {
    expect(computeStreak([], NOW)).toEqual({ days: 0, capped: false });
    expect(computeStreak([item(3, { is_custom: true })], NOW)).toEqual({
      days: 0,
      capped: false,
    });
  });

  test('future due dates are ignored', () => {
    const future = new Date(NOW);
    future.setDate(future.getDate() + 3);
    const r = computeStreak(
      [
        item(6, { missing: true }),
        { ...item(0), due_at: future.toISOString(), missing: true },
      ],
      NOW
    );
    expect(r.days).toBe(6);
  });
});

describe('countDueToday', () => {
  const at = (h: number, m = 0) => {
    const d = new Date(NOW);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  test('counts unfinished course work due later today', () => {
    expect(
      countDueToday(
        [
          { due_at: at(23, 59), done: false, is_custom: false },
          { due_at: at(17), done: false, is_custom: false },
          { due_at: at(18), done: true, is_custom: false }, // finished
          { due_at: at(19), done: false, is_custom: true }, // custom task
          { due_at: at(9), done: false, is_custom: false }, // already past due
          { due_at: daysAgo(-1), done: false, is_custom: false }, // tomorrow
          {
            due_at: at(20),
            done: false,
            is_custom: false,
            needs_grading: true,
          },
        ],
        NOW
      )
    ).toBe(2);
  });
});
