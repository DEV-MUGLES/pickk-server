export const isEqualSet = (a: Set<unknown>, b: Set<unknown>): boolean => {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.size === b.size && [...a].every((value) => b.has(value));
};
