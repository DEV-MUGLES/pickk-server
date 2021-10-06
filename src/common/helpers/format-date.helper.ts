import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Timezone } from '@common/constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export const format2Korean = (date: Date): string =>
  dayjs
    .tz(date, Timezone.Seoul)
    .format('YYYY년 MM월 DD일 a hh:mm:ss')
    .replace('pm', '오후')
    .replace('am', '오전');
