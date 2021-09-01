import dayjs from 'dayjs';

import {
  digestHitScoreVariable,
  ScoreUpdateType,
  videoHitScoreVariable,
  lookHitScoreVariable,
} from '../constants';

function getHitScoreVariableByType(type: ScoreUpdateType) {
  if (type === ScoreUpdateType.Digest) {
    return digestHitScoreVariable;
  }
  if (type === ScoreUpdateType.Look) {
    return lookHitScoreVariable;
  }
  if (type === ScoreUpdateType.Video) {
    return videoHitScoreVariable;
  }
}

const ADDITIONAL_HOUR = 48;
export function calculateHitScore(
  hitCount: number,
  createdAt: Date,
  type: ScoreUpdateType
) {
  const { primaryCliffHour, secondaryCliffHour, n1, n2, n3 } =
    getHitScoreVariableByType(type);
  const passedHour = dayjs().diff(createdAt, 'hour');

  if (passedHour < primaryCliffHour) {
    return hitCount / Math.pow(passedHour + ADDITIONAL_HOUR, n1);
  }
  if (passedHour < secondaryCliffHour) {
    return (
      hitCount /
      (Math.pow(primaryCliffHour + ADDITIONAL_HOUR, n1) +
        Math.pow(passedHour - primaryCliffHour, n2))
    );
  }
  return (
    hitCount /
    (Math.pow(primaryCliffHour + ADDITIONAL_HOUR, n1) +
      Math.pow(secondaryCliffHour - primaryCliffHour, n2) +
      Math.pow(passedHour - secondaryCliffHour, n3))
  );
}

export function calculateLikeCommentOrderScore(
  likeCount: number,
  commentCount: number,
  orderItemCount: number,
  currentScore: number
) {
  const LIKE_WEIGHT = 0.1;
  const COMMENT_WEIGHT = 0.05;
  const ORDER_WEIGHT = 0.2;

  return (
    currentScore / 3 +
    (likeCount * LIKE_WEIGHT +
      commentCount * COMMENT_WEIGHT +
      orderItemCount * ORDER_WEIGHT) /
      2
  );
}

export function calculateLikeCommentScore(
  likeCount: number,
  commentCount: number,
  currentScore: number
) {
  const LIKE_WEIGHT = 0.15;
  const COMMENT_WEIGHT = 0.1;

  return (
    currentScore / 3 +
    (likeCount * LIKE_WEIGHT + commentCount * COMMENT_WEIGHT) / 2
  );
}
