import { AssignmentDefaults } from '../../../constants';
import { AssignmentType, FinalAssignment } from '../../../types';
import { ringProgress } from './ringProgress';

function assignment(partial: Partial<FinalAssignment>): FinalAssignment {
  return { ...AssignmentDefaults, ...partial };
}

describe('ringProgress', () => {
  describe('instructor/TA items (total_submissions set)', () => {
    it('counts graded submissions', () => {
      expect(
        ringProgress(
          assignment({ total_submissions: 10, needs_grading_count: 3 })
        )
      ).toBe(7);
    });

    it('is full when nothing needs grading (0 is not "unknown")', () => {
      expect(
        ringProgress(
          assignment({ total_submissions: 10, needs_grading_count: 0 })
        )
      ).toBe(10);
    });

    it('is empty when the ungraded count is unknown', () => {
      expect(
        ringProgress(
          assignment({ total_submissions: 10, needs_grading_count: undefined })
        )
      ).toBe(0);
    });

    it('never goes negative (#173)', () => {
      expect(
        ringProgress(
          assignment({ total_submissions: 2, needs_grading_count: 5 })
        )
      ).toBe(0);
    });

    it('never exceeds the total', () => {
      expect(
        ringProgress(
          assignment({ total_submissions: 4, needs_grading_count: -3 })
        )
      ).toBe(4);
    });
  });

  describe('student items', () => {
    it('is 1 when submitted', () => {
      expect(ringProgress(assignment({ submitted: true }))).toBe(1);
    });

    it('is 0 when not done', () => {
      expect(
        ringProgress(
          assignment({
            submitted: false,
            graded: false,
            marked_complete: false,
          })
        )
      ).toBe(0);
    });

    it('ignores total_submissions on custom notes', () => {
      expect(
        ringProgress(
          assignment({
            type: AssignmentType.NOTE,
            total_submissions: 1,
            needs_grading_count: 1,
            marked_complete: true,
          })
        )
      ).toBe(1);
    });
  });
});
