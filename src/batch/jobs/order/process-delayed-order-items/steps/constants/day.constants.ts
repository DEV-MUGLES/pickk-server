import dayjs from 'dayjs';

/** null인 날짜에 대해서는 null 대신 사용되는 값입니다. 2000-01-01의 날짜를 값으로 가집니다.*/
export const oldDay = dayjs(new Date(2000, 1, 1));
