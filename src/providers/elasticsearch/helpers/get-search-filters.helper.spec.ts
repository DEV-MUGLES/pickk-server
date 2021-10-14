import * as faker from 'faker';

import { getSearchFilters } from './get-search-filters.helper';

describe('getSearchFilters', () => {
  it('should return {} when falsy params given', () => {
    expect(getSearchFilters(null, null)).toEqual([]);
    expect(getSearchFilters(null, undefined)).toEqual([]);
  });

  it('query를 성공적으로 변환한다.', () => {
    const query = faker.lorem.text();

    expect(getSearchFilters(query)).toEqual([
      {
        multi_match: {
          query,
          type: 'phrase_prefix',
        },
      },
    ]);
  });

  it('should parse In', () => {
    const strs = [faker.lorem.text(), faker.lorem.text(), faker.lorem.text()];
    const nums = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ];

    expect(getSearchFilters(null, { nameIn: strs })).toEqual([
      {
        bool: {
          should: [
            { match_phrase: { name: strs[0] } },
            { match_phrase: { name: strs[1] } },
            { match_phrase: { name: strs[2] } },
          ],
          minimum_should_match: 1,
        },
      },
    ]);
    expect(getSearchFilters(null, { ageIn: nums })).toEqual([
      {
        bool: {
          should: [
            { match_phrase: { age: nums[0] } },
            { match_phrase: { age: nums[1] } },
            { match_phrase: { age: nums[2] } },
          ],
          minimum_should_match: 1,
        },
      },
    ]);
  });

  it('should parse Between', () => {
    const [from, to] = [faker.datatype.number(), faker.datatype.number()].sort(
      (a, b) => a - b
    );

    const inputs = [
      [from, to],
      [new Date(from), new Date(to)],
    ];

    for (const input of inputs) {
      expect(getSearchFilters(null, { nameBetween: input })).toEqual([
        { range: { name: { gte: input[0], lte: input[1] } } },
      ]);
    }
  });

  it('should parse Mt', () => {
    const num = faker.datatype.number();

    expect(getSearchFilters(null, { ageMt: num })).toEqual([
      { range: { age: { gt: num } } },
    ]);
  });

  it('should parse Mte', () => {
    const num = faker.datatype.number();

    expect(getSearchFilters(null, { ageMte: num })).toEqual([
      { range: { age: { gte: num } } },
    ]);
  });

  it('should parse Lt', () => {
    const num = faker.datatype.number();

    expect(getSearchFilters(null, { ageLt: num })).toEqual([
      { range: { age: { lt: num } } },
    ]);
  });

  it('should parse Lte', () => {
    const num = faker.datatype.number();

    expect(getSearchFilters(null, { ageLte: num })).toEqual([
      { range: { age: { lte: num } } },
    ]);
  });

  it('should parse multiple filters', () => {
    const query = faker.lorem.text();

    const name = faker.lorem.word();
    const idIn = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ];
    const ageLte = faker.datatype.number();

    expect(getSearchFilters(query, { name, idIn, ageLte })).toEqual([
      {
        multi_match: {
          query,
          type: 'phrase_prefix',
        },
      },
      { match_phrase: { name } },
      {
        bool: {
          should: [
            { match_phrase: { id: idIn[0] } },
            { match_phrase: { id: idIn[1] } },
            { match_phrase: { id: idIn[2] } },
          ],
          minimum_should_match: 1,
        },
      },
      { range: { age: { lte: ageLte } } },
    ]);
  });
});
