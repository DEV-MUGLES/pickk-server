const FIRST_DIFF_WEIGHT = 0.25;
const SECOND_DIFF_WEIGHT = 0.05;

export enum ReactionScoreWeight {
  Like = 0.05,
  Comment = 0.025,
  Order = 0.05,
}

export function calculateReactionScore(
  diffs: number[],
  weight: ReactionScoreWeight
) {
  return (
    (diffs[0] * FIRST_DIFF_WEIGHT + diffs[1] * SECOND_DIFF_WEIGHT) * weight
  );
}
