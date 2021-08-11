export const isIterator = (obj: unknown) => {
  return !!obj && !!obj[Symbol.iterator];
};
