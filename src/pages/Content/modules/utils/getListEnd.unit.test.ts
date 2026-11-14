import { getListEnd, LIST_LOOKAHEAD_DAYS } from './getPeriod';

// Week of Mon Nov 9 3pm to Mon Nov 16 3pm; today is Thu Nov 12
const start = new Date(2026, 10, 9, 15, 0);
const end = new Date(2026, 10, 16, 15, 0);
const now = new Date(2026, 10, 12, 10, 0);

test('current period extends to the end of the 14th day from today', () => {
  expect(LIST_LOOKAHEAD_DAYS).toBe(14);
  // Nov 12 + 14 days = Nov 26, so up to midnight starting Nov 27
  expect(getListEnd(start, end, now)).toEqual(new Date(2026, 10, 27));
});

test('past and future periods keep their own end', () => {
  const nextStart = new Date(2026, 10, 16, 15, 0);
  const nextEnd = new Date(2026, 10, 23, 15, 0);
  expect(getListEnd(nextStart, nextEnd, now)).toBe(nextEnd);
  const prevStart = new Date(2026, 10, 2, 15, 0);
  expect(getListEnd(prevStart, start, now)).toBe(start);
});

test('a period longer than the lookahead keeps its own end', () => {
  const monthStart = new Date(2026, 10, 1);
  const monthEnd = new Date(2026, 11, 1);
  expect(getListEnd(monthStart, monthEnd, new Date(2026, 10, 3))).toBe(
    monthEnd
  );
});
