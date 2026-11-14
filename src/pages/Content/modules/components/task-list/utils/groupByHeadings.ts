import { FinalAssignment } from '../../../types';
import assignmentHasGrade from '../../../utils/assignmentHasGrade';
import getDaysLeft from './getDaysLeft';
import { TaskTypeTab } from './useHeadings';

// Anything due this many days away or more goes under one "Later" heading.
export const LATER_THRESHOLD_DAYS = 4;
export const LATER_HEADING = 'Later';

export function getDueDateHeadingLabel(delta: number): string {
  if (delta < 0) return 'Overdue';
  if (delta === 0) return 'Today';
  if (delta === 1) return 'Tomorrow';
  if (delta < LATER_THRESHOLD_DAYS) return `${delta} days`;
  return LATER_HEADING;
}

export function groupByDateHeadings(
  assignments: FinalAssignment[]
): Record<string, FinalAssignment[]> {
  const headings: Record<string, FinalAssignment[]> = {};
  assignments.forEach((a) => {
    if (a.needs_grading_count) {
      if (!('Needs Grading' in headings)) headings['Needs Grading'] = [];
      headings['Needs Grading'].push(a);
    } else {
      const daysLeft = getDueDateHeadingLabel(getDaysLeft(a));
      if (!(daysLeft in headings)) headings[daysLeft] = [];
      headings[daysLeft].push(a);
    }
  });
  return headings;
}

export function groupByStatusHeadings(
  assignments: FinalAssignment[],
  currentTab: TaskTypeTab = 'Completed'
): Record<string, FinalAssignment[]> {
  const headings: Record<string, FinalAssignment[]> = {
    Graded: [],
    Ungraded: [],
    Unread: [],
    Seen: [],
  };
  if (currentTab === 'Completed') {
    assignments.forEach((a) => {
      if (assignmentHasGrade(a)) headings['Graded'].push(a);
      else headings['Ungraded'].push(a);
    });
  } else if (currentTab === 'Announcements') {
    assignments.forEach((a) => {
      if (a.marked_complete) headings['Seen'].push(a);
      else headings['Unread'].push(a);
    });
  }
  return headings;
}
