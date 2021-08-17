import dayjs from 'dayjs';

/** null인 날짜에 대해서는 null 대신 사용되는 값입니다. 현재 날짜로부터 한달전 날짜를 반환합니다.*/
export const oldDay = dayjs().add(-1, 'month');
