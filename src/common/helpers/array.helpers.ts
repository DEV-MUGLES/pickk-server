export const isAllEleSame = (arr: unknown[]): boolean =>
  [...new Set(arr)].length <= 1;

/** 두 배열의 차집합을 반환합니다.
 * @param origin 원본 배열입니다.
 * @param sub 뺄 배열입니다. */
export const diffArr = <T = unknown>(origin: T[], sub: T[]): T[] =>
  origin.filter((v) => !sub.includes(v));
