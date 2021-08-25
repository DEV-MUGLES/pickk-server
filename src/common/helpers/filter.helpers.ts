import { isArray as _isArray, isDate, isObject } from 'class-validator';
import {
  Between,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

type TFilterValue = unknown | unknown[] | Record<string, unknown | unknown[]>;

type TFilter = Record<string, unknown | unknown[] | TFilterValue>;

export const isFilter = (value: unknown): value is TFilter => {
  return value != null && isObject(value) && !isDate(value);
};

type TSearchableFilter = {
  search: string;
  searchFields: string[];
};

export const isSearchableFilter = (
  value: TFilter
): value is TSearchableFilter => {
  return (
    value != null &&
    value.search !== undefined &&
    value.searchFields !== undefined &&
    isObject(value)
  );
};

export const getSearchFilter = (searchField: string, search: string) => {
  if (searchField.indexOf('.') === -1) {
    return {
      [searchField]: Like(`%${search}%`),
    };
  }

  const chunks = searchField.split('.');

  if (chunks.length === 2) {
    const [relation, field] = chunks;
    return {
      [relation]: {
        [field]: Like(`%${search}%`),
      },
    };
  } else {
    const [relation1, relation2, field] = chunks;
    return {
      [relation1]: {
        [relation2]: {
          [field]: Like(`%${search}%`),
        },
      },
    };
  }
};

export const isArray = (value: unknown): value is Array<unknown> => {
  return _isArray(value);
};

export const parseFilter = (filter: unknown, idFilter: any = {}) => {
  if (!isFilter(filter)) {
    return idFilter;
  }

  const newFilter = Object.keys(filter ?? {}).reduce((acc, key) => {
    const value = filter[key];
    if (isFilter(value)) {
      return { ...acc, [key]: parseFilter(value, {}) };
    }
    if ((filter['excludeFields'] as string[])?.includes(key)) {
      return acc;
    }
    if (['search', 'searchFields', 'excludeFields', 'orderBy'].includes(key)) {
      return acc;
    }
    if (/In$/.test(key) && isArray(value)) {
      return {
        ...acc,
        [key.replace(/In$/, '')]: In(value),
      };
    }
    if (/Between$/.test(key) && isArray(value)) {
      /** sort given array, get first, second element. array values can be Date or Number */
      const [from, to] = [].concat(value).sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0;
      });

      return {
        ...acc,
        [key.replace(/Between$/, '')]: Between(from, to),
      };
    }
    if (/Mte$/.test(key)) {
      return {
        ...acc,
        [key.replace(/Mte$/, '')]: MoreThanOrEqual(value),
      };
    }
    if (/Lte$/.test(key)) {
      return {
        ...acc,
        [key.replace(/Lte$/, '')]: LessThanOrEqual(value),
      };
    }
    if (/IsNull$/.test(key)) {
      return {
        ...acc,
        [key.replace(/IsNull$/, '')]: value ? IsNull() : Not(IsNull()),
      };
    }

    return { ...acc, [key]: value };
  }, idFilter);

  if (!isSearchableFilter(filter)) {
    return newFilter;
  }

  return filter.searchFields.map((searchField: string) => ({
    ...newFilter,
    ...getSearchFilter(searchField, filter.search),
  }));
};
