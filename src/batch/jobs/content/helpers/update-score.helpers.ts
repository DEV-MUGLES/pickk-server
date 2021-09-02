import dayjs from 'dayjs';

import {
  digestHitScoreVariable,
  UpdateContentScoreType,
  videoHitScoreVariable,
  lookHitScoreVariable,
} from '../constants';

function getHitScoreVariableByType(type: UpdateContentScoreType) {
  if (type === UpdateContentScoreType.Digest) {
    return digestHitScoreVariable;
  }
  if (type === UpdateContentScoreType.Look) {
    return lookHitScoreVariable;
  }
  if (type === UpdateContentScoreType.Video) {
    return videoHitScoreVariable;
  }
}
/**
 * 계산시 사용되는 time의 단위는 시간(hour)입니다.
 */
const ADDITIONAL_TIME = 48;
export function calculateHitScore(
  hitCount: number,
  createdAt: Date,
  type: UpdateContentScoreType
) {
  const {
    firstCliffTime,
    secondCliffTime,
    firstIntervalPower,
    secondIntervalPower,
    thirdIntervalPower,
  } = getHitScoreVariableByType(type);
  const passedTime = dayjs().diff(createdAt, 'hour');

  if (passedTime < firstCliffTime) {
    return (
      hitCount / Math.pow(passedTime + ADDITIONAL_TIME, firstIntervalPower)
    );
  }
  if (passedTime < secondCliffTime) {
    return (
      hitCount /
      (Math.pow(firstCliffTime + ADDITIONAL_TIME, firstIntervalPower) +
        Math.pow(passedTime - firstCliffTime, secondIntervalPower))
    );
  }
  return (
    hitCount /
    (Math.pow(firstCliffTime + ADDITIONAL_TIME, firstIntervalPower) +
      Math.pow(secondCliffTime - firstCliffTime, secondIntervalPower) +
      Math.pow(passedTime - secondCliffTime, thirdIntervalPower))
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
