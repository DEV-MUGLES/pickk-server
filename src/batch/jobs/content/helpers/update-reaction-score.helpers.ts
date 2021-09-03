import dayjs from 'dayjs';

const FIRST_INTERVAL_START_HOUR = 168;
const FIRST_INTERVAL_END_HOUR = 0;
export function getReactionScoreFirstInterval() {
  return [
    dayjs().subtract(FIRST_INTERVAL_START_HOUR, 'hour').toDate(),
    dayjs().subtract(FIRST_INTERVAL_END_HOUR, 'hour').toDate(),
  ];
}

const SECOND_INTERVAL_START_HOUR = 600;
const SECOND_INTERVAL_END_HOUR = 169;
export function getReactionScoreSecondInterval() {
  return [
    dayjs().subtract(SECOND_INTERVAL_START_HOUR, 'hour').toDate(),
    dayjs().subtract(SECOND_INTERVAL_END_HOUR, 'hour').toDate(),
  ];
}
