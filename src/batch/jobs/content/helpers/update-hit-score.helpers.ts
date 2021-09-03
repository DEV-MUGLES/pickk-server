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

const ADDITIONAL_HOUR = 48;
export function calculateHitScore(
  hitCount: number,
  createdAt: Date,
  type: UpdateContentScoreType
) {
  const {
    firstCliffHour,
    secondCliffHour,
    firstIntervalPower,
    secondIntervalPower,
    thirdIntervalPower,
  } = getHitScoreVariableByType(type);
  const passedHour = dayjs().diff(createdAt, 'hour');

  if (passedHour < firstCliffHour) {
    return (
      hitCount / Math.pow(passedHour + ADDITIONAL_HOUR, firstIntervalPower)
    );
  }
  if (passedHour < secondCliffHour) {
    return (
      hitCount /
      (Math.pow(firstCliffHour + ADDITIONAL_HOUR, firstIntervalPower) +
        Math.pow(passedHour - firstCliffHour, secondIntervalPower))
    );
  }
  return (
    hitCount /
    (Math.pow(firstCliffHour + ADDITIONAL_HOUR, firstIntervalPower) +
      Math.pow(secondCliffHour - firstCliffHour, secondIntervalPower) +
      Math.pow(passedHour - secondCliffHour, thirdIntervalPower))
  );
}
