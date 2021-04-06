import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import * as faker from 'faker';

import {
  isArray,
  isFilter,
  isSearchableFilter,
  parseFilter,
} from './filter.helpers';

describe('FilterHelpers', () => {
  describe('isArray', () => {
    it('should return true when given array', () => {
      expect(isArray([null])).toEqual(true);
      expect(isArray([])).toEqual(true);
      expect(isArray([3])).toEqual(true);
      expect(isArray(['a', 3])).toEqual(true);
    });

    it('should return false when given non-array', () => {
      expect(isArray(null)).toEqual(false);
      expect(isArray(undefined)).toEqual(false);
      expect(isArray(3)).toEqual(false);
      expect(isArray('a')).toEqual(false);
    });
  });

  describe('isFilter', () => {
    it('should return true when given array', () => {
      expect(isFilter({})).toEqual(true);
      expect(isFilter({ name: '최수민' })).toEqual(true);
      expect(isFilter({ 3: 6 })).toEqual(true);
    });

    it('should return false when given non-array', () => {
      expect(isFilter(null)).toEqual(false);
      expect(isFilter(undefined)).toEqual(false);
      expect(isFilter(3)).toEqual(false);
      expect(isFilter('a')).toEqual(false);
    });
  });

  describe('isSearchableFilter', () => {
    it('should return true when search,searchFields exist', () => {
      expect(
        isSearchableFilter({
          search: 'hi',
          searchFields: ['name', 'title'],
        })
      ).toEqual(true);
      expect(
        isSearchableFilter({
          search: 'hi',
          searchFields: ['name', 'title'],
          age: 27,
        })
      ).toEqual(true);
      expect(
        isSearchableFilter({
          search: '',
          searchFields: [],
        })
      ).toEqual(true);
    });

    it('should return false when given non-searchableFilter', () => {
      expect(isSearchableFilter({})).toEqual(false);
      expect(isSearchableFilter({ name: '최수민' })).toEqual(false);
      expect(isSearchableFilter({ 3: 6 })).toEqual(false);
      expect(isSearchableFilter(null)).toEqual(false);
      expect(isSearchableFilter(undefined)).toEqual(false);
    });
  });

  describe('parseFilter', () => {
    it('should return {} when filter is falsy', () => {
      expect(parseFilter(null)).toEqual({});
      expect(parseFilter(undefined)).toEqual({});
    });

    it('should parse In', () => {
      const strs = [faker.lorem.text(), faker.lorem.text(), faker.lorem.text()];
      const nums = [
        faker.random.number(),
        faker.random.number(),
        faker.random.number(),
      ];

      expect(parseFilter({ nameIn: strs })).toEqual({
        name: In(strs),
      });
      expect(parseFilter({ ageIn: nums })).toEqual({
        age: In(nums),
      });
    });

    it('should parse Between', () => {
      const [start, end] = [
        faker.random.number(),
        faker.random.number(),
      ].sort();

      expect(parseFilter({ ageBetween: [start, end] })).toEqual({
        age: Between(start, end),
      });
    });

    it('should parse Mte', () => {
      const num = faker.random.number();

      expect(parseFilter({ ageMte: num })).toEqual({
        age: MoreThanOrEqual(num),
      });
    });

    it('should parse Lte', () => {
      const num = faker.random.number();

      expect(parseFilter({ ageLte: num })).toEqual({
        age: LessThanOrEqual(num),
      });
    });

    it('should work for nested filters', () => {
      const userAgeMte = faker.random.number();
      const itemNameIn = [
        faker.lorem.text(),
        faker.lorem.text(),
        faker.lorem.text(),
      ];

      expect(
        parseFilter({
          user: {
            ageMte: userAgeMte,
            height: 180,
          },
          item: {
            nameIn: itemNameIn,
            brandKor: '수아레',
          },
        })
      ).toEqual({
        user: {
          age: MoreThanOrEqual(userAgeMte),
          height: 180,
        },
        item: {
          name: In(itemNameIn),
          brandKor: '수아레',
        },
      });
    });
  });
});
