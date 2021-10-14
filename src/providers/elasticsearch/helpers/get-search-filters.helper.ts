import { isArray } from '@common/helpers';
import { isBoolean } from 'class-validator';

import { SearchFilter } from '../types';

export const getSearchFilters = (
  query?: string,
  input?: Record<string, unknown>
): SearchFilter[] => {
  const result: SearchFilter[] = [];

  if (query != null) {
    result.push({
      multi_match: {
        query,
        type: 'phrase_prefix',
      },
    });
  }

  Object.keys(input ?? {}).forEach((key) => {
    const value = input[key];
    if (/In$/.test(key) && isArray(value)) {
      result.push({
        bool: {
          should: value.map((v) => ({
            match_phrase: {
              [key.replace(/In$/, '')]: v,
            },
          })),
          minimum_should_match: 1,
        },
      });
      return;
    }
    if (/Between$/.test(key) && isArray(value)) {
      /** sort given array, get first, second element. array values can be Date or Number */
      const [from, to] = [].concat(value).sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0;
      });

      result.push({
        range: {
          [key.replace(/Between$/, '')]: {
            gte: from,
            lte: to,
          },
        },
      });
      return;
    }
    if (/Mt$/.test(key) && !isArray(value)) {
      result.push({
        range: {
          [key.replace(/Mt$/, '')]: {
            gt: value,
          },
        },
      });
      return;
    }
    if (/Mte$/.test(key) && !isArray(value)) {
      result.push({
        range: {
          [key.replace(/Mte$/, '')]: {
            gte: value,
          },
        },
      });
      return;
    }
    if (/Lt$/.test(key) && !isArray(value)) {
      result.push({
        range: {
          [key.replace(/Lt$/, '')]: {
            lt: value,
          },
        },
      });
      return;
    }
    if (/Lte$/.test(key) && !isArray(value)) {
      result.push({
        range: {
          [key.replace(/Lte$/, '')]: {
            lte: value,
          },
        },
      });
      return;
    }
    if (/IsNull$/.test(key) && isBoolean(value)) {
      const field = key.replace(/IsNull$/, '');
      if (value === true) {
        result.push({ match_phrase: { [field]: null } });
      } else {
        result.push({ exists: { field } });
      }

      return;
    }

    // 일반 필터
    result.push({
      match_phrase: {
        [key]: value,
      },
    });
  }, {} as SearchFilter);

  return result;
};
