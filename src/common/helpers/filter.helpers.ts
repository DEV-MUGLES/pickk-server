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
  return isObject(value) && !isDate(value);
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

export const isArray = (value): value is Array<unknown> => {
  return _isArray(value);
};

export const parseFilter = (filter: unknown, idFilter: any = {}) => {
  if (!filter || !isFilter(filter)) {
    return {};
  }

  const newFilter = Object.keys(filter ?? {}).reduce((acc, key) => {
    const value = filter[key];
    if (isFilter(value)) {
      return { ...acc, [key]: parseFilter(value, {}) };
    }
    if (['search', 'searchFields'].includes(key)) {
      return acc;
    }
    if (/In$/.test(key) && isArray(value)) {
      return {
        ...acc,
        [key.replace(/In$/, '')]: In(value),
      };
    }
    if (/Between$/.test(key) && isArray(value)) {
      const [start, end] = value;
      return {
        ...acc,
        [key.replace(/Between$/, '')]: Between(start, end),
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
  }, idFilter ?? {});

  if (!isSearchableFilter(filter)) {
    return newFilter;
  }

  return filter.searchFields.map((searchField: string) => ({
    ...newFilter,
    [searchField]: Like(`%${filter.search}%`),
  }));
};
