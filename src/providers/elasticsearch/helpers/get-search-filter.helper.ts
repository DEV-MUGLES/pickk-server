import { isArray } from '@common/helpers';
import { isBoolean } from 'class-validator';

import { SearchFilter } from '../types';

export const getSearchFilter = (
  query?: string,
  input?: Record<string, unknown>
): { must: SearchFilter[]; must_not: SearchFilter[] } => {
  const must: SearchFilter[] = [];
  const must_not: SearchFilter[] = [];

  if (query != null) {
    must.push({
      multi_match: {
        query,
        type: 'phrase_prefix',
      },
    });
  }

  Object.keys(input ?? {}).forEach((key) => {
    const value = input[key];
    if (/In$/.test(key) && isArray(value)) {
      must.push({
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

      must.push({
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
      must.push({
        range: {
          [key.replace(/Mt$/, '')]: {
            gt: value,
          },
        },
      });
      return;
    }
    if (/Mte$/.test(key) && !isArray(value)) {
      must.push({
        range: {
          [key.replace(/Mte$/, '')]: {
            gte: value,
          },
        },
      });
      return;
    }
    if (/Lt$/.test(key) && !isArray(value)) {
      must.push({
        range: {
          [key.replace(/Lt$/, '')]: {
            lt: value,
          },
        },
      });
      return;
    }
    if (/Lte$/.test(key) && !isArray(value)) {
      must.push({
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
        must_not.push({ exists: { field } });
      } else {
        must.push({ exists: { field } });
      }

      return;
    }

    // null, undefined는 처리하지 않는다.
    if (value == null) {
      return;
    }

    // 일반 필터
    must.push({
      match_phrase: {
        [key]: value,
      },
    });
  }, {} as SearchFilter);

  return { must, must_not };
};
