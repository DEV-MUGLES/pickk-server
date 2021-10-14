import { isArray } from '@common/helpers';

import { SearchFilter } from '../types';

export const parseSearchFilter = (
  input: Record<string, unknown>
): SearchFilter => {
  if (!input) {
    return {};
  }

  const newFilter = Object.keys(input).reduce((acc, key) => {
    const value = input[key];
    if (/In$/.test(key) && isArray(value)) {
      return {
        ...acc,
        terms: {
          ...acc.terms,
          [key.replace(/In$/, '')]: value,
        },
      };
    }
    if (/Between$/.test(key) && isArray(value)) {
      /** sort given array, get first, second element. array values can be Date or Number */
      const [from, to] = [].concat(value).sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0;
      });

      return {
        ...acc,
        range: {
          ...acc.range,
          [key.replace(/Between$/, '')]: {
            gte: from,
            lte: to,
          },
        },
      };
    }
    if (/Mt$/.test(key) && !isArray(value)) {
      return {
        ...acc,
        range: {
          ...acc.range,
          [key.replace(/Mt$/, '')]: {
            gt: value,
          },
        },
      };
    }
    if (/Mte$/.test(key) && !isArray(value)) {
      return {
        ...acc,
        range: {
          ...acc.range,
          [key.replace(/Mte$/, '')]: {
            gte: value,
          },
        },
      };
    }
    if (/Lt$/.test(key) && !isArray(value)) {
      return {
        ...acc,
        range: {
          ...acc.range,
          [key.replace(/Lt$/, '')]: {
            lt: value,
          },
        },
      };
    }
    if (/Lte$/.test(key) && !isArray(value)) {
      return {
        ...acc,
        range: {
          ...acc.range,
          [key.replace(/Lte$/, '')]: {
            lte: value,
          },
        },
      };
    }

    // 일반 필터
    return {
      ...acc,
      term: {
        ...acc.term,
        [key]: value,
      },
    };
  }, {} as SearchFilter);

  return newFilter;
};
