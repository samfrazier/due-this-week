import { AssignmentType, PlannerAssignment } from '../../../types';
import baseURL from '../../../utils/baseURL';
import isDemo from '../../../utils/isDemo';
import { StreakItem, STREAK_LOOKBACK_DAYS } from '../../../utils/streak';
import { getPaginatedRequest } from './loadCanvas';

function dateString(d: Date): string {
  return d.toISOString().split('T')[0];
}

/* Planner items -> streak items. Only things with a submission (real course
   work) and custom tasks are kept; pages, events, and announcements are not. */
export function toStreakItems(items: PlannerAssignment[]): StreakItem[] {
  return items
    .filter((a) => a.plannable_type === AssignmentType.NOTE || !!a.submissions)
    .map((a) => {
      const sub = a.submissions || {};
      return {
        due_at:
          a.plannable?.due_at ||
          a.plannable?.todo_date ||
          a.plannable_date ||
          '',
        missing: !!sub.missing,
        excused: !!sub.excused,
        marked_complete:
          !!a.planner_override?.marked_complete ||
          !!a.planner_override?.dismissed,
        is_custom: a.plannable_type === AssignmentType.NOTE,
      };
    });
}

/* Sample streak for the demo page: last missed 12 days ago. */
function demoStreakItems(): StreakItem[] {
  const d = (daysAgo: number) => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  };
  const base = {
    missing: false,
    excused: false,
    marked_complete: false,
    is_custom: false,
  };
  return [
    { ...base, due_at: d(20) },
    { ...base, due_at: d(12), missing: true },
    { ...base, due_at: d(9) },
    { ...base, due_at: d(4) },
    { ...base, due_at: d(1) },
  ];
}

/* Reads the student's own planner for about one semester. Runs in the
   browser against the school's Canvas only; nothing is sent anywhere else. */
export default async function loadStreakItemsCanvas(): Promise<StreakItem[]> {
  if (isDemo()) return demoStreakItems();
  const start = new Date(Date.now());
  start.setDate(start.getDate() - STREAK_LOOKBACK_DAYS - 1);
  const end = new Date(Date.now());
  end.setDate(end.getDate() + 1);
  const url = `${baseURL()}/api/v1/planner/items?start_date=${dateString(
    start
  )}&end_date=${dateString(end)}&per_page=100`;
  const items = await getPaginatedRequest<PlannerAssignment>(url, true);
  return toStreakItems(items);
}
