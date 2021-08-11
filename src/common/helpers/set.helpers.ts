export const isEqualSet = (a: Set<unknown>, b: Set<unknown>): boolean =>
  a.size === b.size && [...a].every((value) => b.has(value));
