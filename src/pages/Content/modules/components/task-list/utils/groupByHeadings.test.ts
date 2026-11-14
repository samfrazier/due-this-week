import { FinalAssignment } from '../../../types';
import { AssignmentDefaults } from '../../../constants';
import {
  getDueDateHeadingLabel,
  groupByDateHeadings,
  LATER_HEADING,
} from './groupByHeadings';

describe('getDueDateHeadingLabel', () => {
  test.each([
    [-5, 'Overdue'],
    [-1, 'Overdue'],
    [0, 'Today'],
    [1, 'Tomorrow'],
    [2, '2 days'],
    [3, '3 days'],
    [4, LATER_HEADING],
    [7, LATER_HEADING],
    [14, LATER_HEADING],
    [40, LATER_HEADING],
  ])('%i days away -> %s', (delta, label) => {
    expect(getDueDateHeadingLabel(delta)).toBe(label);
  });
});

describe('groupByDateHeadings', () => {
  let dateNowSpy: jest.SpyInstance;
  beforeAll(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2026, 10, 9, 9, 0, 0).valueOf());
  });
  afterAll(() => dateNowSpy.mockRestore());

  const due = (day: number, id: string): FinalAssignment => ({
    ...AssignmentDefaults,
    id,
    due_at: new Date(2026, 10, day, 23, 59).toISOString(),
  });

  test('puts everything 4+ days away under one Later heading, in order', () => {
    const groups = groupByDateHeadings([
      due(9, 'today'),
      due(12, 'three'),
      due(13, 'four'),
      due(16, 'week'),
      due(30, 'weeks'),
    ]);
    expect(Object.keys(groups)).toEqual(['Today', '3 days', LATER_HEADING]);
    expect(groups[LATER_HEADING].map((a) => a.id)).toEqual([
      'four',
      'week',
      'weeks',
    ]);
  });

  test('Needs Grading keeps its own heading', () => {
    const groups = groupByDateHeadings([
      { ...due(20, 'grade'), needs_grading_count: 3 },
    ]);
    expect(Object.keys(groups)).toEqual(['Needs Grading']);
  });
});
