import {
  Between,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
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
    it('should return true when given value is Record<string|number, any>', () => {
      expect(isFilter({})).toEqual(true);
      expect(isFilter({ name: '최수민' })).toEqual(true);
      expect(isFilter({ 3: 6 })).toEqual(true);
      expect(isFilter({ name: { name: '최수민' } })).toEqual(true);
    });

    it('should return false when given non-filter', () => {
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
        faker.datatype.number(),
        faker.datatype.number(),
        faker.datatype.number(),
      ];

      expect(parseFilter({ nameIn: strs })).toEqual({
        name: In(strs),
      });
      expect(parseFilter({ ageIn: nums })).toEqual({
        age: In(nums),
      });
    });

    it('should parse Between', () => {
      const [from, to] = [
        faker.datatype.number(),
        faker.datatype.number(),
      ].sort((a, b) => a - b);

      const inputs = [
        [from, to],
        [new Date(from), new Date(to)],
      ];

      for (const input of inputs) {
        expect(parseFilter({ nameBetween: input })).toEqual({
          name: Between(input[0], input[1]),
        });
      }
    });

    it('should parse Mte', () => {
      const num = faker.datatype.number();

      expect(parseFilter({ ageMte: num })).toEqual({
        age: MoreThanOrEqual(num),
      });
    });

    it('should parse Lte', () => {
      const num = faker.datatype.number();

      expect(parseFilter({ ageLte: num })).toEqual({
        age: LessThanOrEqual(num),
      });
    });

    it('should parse IsNull', () => {
      [true, false].forEach((value) => {
        expect(parseFilter({ titleIsNull: value })).toEqual({
          title: value ? IsNull() : Not(IsNull()),
        });
      });
    });

    it('should work for nested filters', () => {
      const userAgeMte = faker.datatype.number();
      const userHeightLte = faker.datatype.number();
      const itemNameIn = [
        faker.lorem.text(),
        faker.lorem.text(),
        faker.lorem.text(),
      ];

      expect(
        parseFilter({
          user: {
            ageMte: userAgeMte,
            heightLte: userHeightLte,
          },
          item: {
            nameIn: itemNameIn,
            brandKor: '수아레',
          },
        })
      ).toEqual({
        user: {
          age: MoreThanOrEqual(userAgeMte),
          height: LessThanOrEqual(userHeightLte),
        },
        item: {
          name: In(itemNameIn),
          brandKor: '수아레',
        },
      });
    });
  });
});
