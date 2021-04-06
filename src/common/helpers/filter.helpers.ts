import { isArray, isObject } from 'class-validator';
import { Between, In, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';

export const parseFilter = (filter: { [key: string]: any }, idFilter: any) => {
  if (!filter && !idFilter) {
    return {};
  }

  const newFilter = Object.keys(filter ?? {}).reduce((acc, key) => {
    if (isObject(filter[key])) {
      return parseFilter(filter[key], {});
    }
    if (['search', 'searchFields'].includes(key)) {
      return acc;
    }
    if (/In$/.test(key) && isArray(filter[key])) {
      return {
        ...acc,
        [key.replace(/In$/, '')]: In(filter[key]),
      };
    }
    if (/Between$/.test(key) && isArray(filter[key])) {
      const [start, end] = filter[key];
      return {
        ...acc,
        [key.replace(/In$/, '')]: Between(start, end),
      };
    }
    if (/Mte$/.test(key)) {
      return {
        ...acc,
        [key.replace(/Mte$/, '')]: MoreThanOrEqual(key),
      };
    }
    if (/Lte$/.test(key)) {
      return {
        ...acc,
        [key.replace(/Lte$/, '')]: LessThanOrEqual(key),
      };
    }

    return { ...acc, [key]: filter[key] };
  }, idFilter ?? {});

  if (!filter.search || !filter.searchFields) {
    return newFilter;
  }

  return filter.searchFields.map((searchField: string) => ({
    ...newFilter,
    [searchField]: Like(`%${filter.search}%`),
  }));
};
