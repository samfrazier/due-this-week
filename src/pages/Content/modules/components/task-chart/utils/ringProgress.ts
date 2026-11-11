import { AssignmentType, FinalAssignment } from '../../../types';
import assignmentIsDone from '../../../utils/assignmentIsDone';

/* How much of an assignment counts as "done" on the progress ring.
 *
 * For instructor/TA items (total_submissions is set): the number of
 * submissions already graded. Otherwise 1 if done, else 0.
 *
 * Fixes from upstream:
 * - `needs_grading_count || total` treated 0 ungraded (everything graded) as
 *   "nothing graded", so a fully graded assignment showed 0% instead of 100%.
 * - The result is clamped to 0..total so odd API data (e.g. #173, negative
 *   counts) can never push the ring or percentage below 0 or above 100%.
 */
export function ringProgress(assignment: FinalAssignment): number {
  const total = assignment.total_submissions;
  if (total && assignment.type !== AssignmentType.NOTE) {
    const ungraded = assignment.needs_grading_count ?? total;
    return Math.min(total, Math.max(0, total - ungraded));
  }
  return assignmentIsDone(assignment) ? 1 : 0;
}
