export const isAllEleSame = (arr: unknown[]): boolean =>
  [...new Set(arr)].length <= 1;
