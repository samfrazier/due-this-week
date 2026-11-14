import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreakBanner from './StreakBanner';
import { toStreakItems } from '../../plugins/canvas/loaders/loadStreak';
import { AssignmentType, PlannerAssignment } from '../../types';

describe('StreakBanner', () => {
  test('active streak', () => {
    render(
      <StreakBanner
        color="#000"
        dueToday={0}
        streak={{ days: 12, capped: false, since: new Date(2026, 10, 1) }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('12-day streak');
    expect(screen.getByRole('status')).toHaveTextContent(
      /No missed assignments since Nov 1/
    );
  });

  test('capped streak', () => {
    render(
      <StreakBanner
        color="#000"
        dueToday={0}
        streak={{ days: 120, capped: true }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('120+ day streak');
  });

  test('warning when work is due today', () => {
    render(
      <StreakBanner
        color="#000"
        dueToday={2}
        streak={{ days: 5, capped: false, since: new Date() }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('2 due today');
  });

  test('singular warning', () => {
    render(
      <StreakBanner
        color="#000"
        dueToday={1}
        streak={{ days: 5, capped: false, since: new Date() }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('1 due today');
  });

  test('no streak yet', () => {
    render(
      <StreakBanner
        color="#000"
        dueToday={3}
        streak={{ days: 0, capped: false }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Start a streakTurn in your next assignment to begin'
    );
  });
});

describe('toStreakItems (Canvas planner items)', () => {
  const base = {
    plannable: { id: '1', title: 'x', due_at: '2026-11-01T00:00:00Z' },
  };
  test('keeps course work and custom tasks, drops everything else', () => {
    const items = toStreakItems([
      {
        ...base,
        plannable_type: AssignmentType.ASSIGNMENT,
        submissions: { missing: true, excused: false },
        planner_override: { id: '9', marked_complete: true, dismissed: false },
      },
      { ...base, plannable_type: AssignmentType.NOTE },
      {
        ...base,
        plannable_type: AssignmentType.ANNOUNCEMENT,
        submissions: false,
      },
    ] as PlannerAssignment[]);
    expect(items).toEqual([
      {
        due_at: '2026-11-01T00:00:00Z',
        missing: true,
        excused: false,
        marked_complete: true,
        is_custom: false,
      },
      {
        due_at: '2026-11-01T00:00:00Z',
        missing: false,
        excused: false,
        marked_complete: false,
        is_custom: true,
      },
    ]);
  });
});
