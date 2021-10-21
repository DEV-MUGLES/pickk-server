import * as faker from 'faker';

import { getSearchFilter } from './get-search-filter.helper';

describe('getSearchFilters', () => {
  it('should return {} when falsy params given', () => {
    expect(getSearchFilter(null, null)).toEqual({ must: [], must_not: [] });
    expect(getSearchFilter(null, undefined)).toEqual({
      must: [],
      must_not: [],
    });
  });

  it('null, undefined는 처리하지 않는다.', () => {
    const status = null;

    expect(getSearchFilter(null, { status })).toEqual({
      must: [],
      must_not: [],
    });
  });

  it('query를 성공적으로 변환한다.', () => {
    const query = faker.lorem.text();

    expect(getSearchFilter(query).must).toEqual([
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

    expect(getSearchFilter(null, { nameIn: strs }).must).toEqual([
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
    expect(getSearchFilter(null, { ageIn: nums }).must).toEqual([
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
      expect(getSearchFilter(null, { nameBetween: input }).must).toEqual([
        { range: { name: { gte: input[0], lte: input[1] } } },
      ]);
    }
  });

  it('should parse Mt', () => {
    const num = faker.datatype.number();

    expect(getSearchFilter(null, { ageMt: num }).must).toEqual([
      { range: { age: { gt: num } } },
    ]);
  });

  it('should parse Mte', () => {
    const num = faker.datatype.number();

    expect(getSearchFilter(null, { ageMte: num }).must).toEqual([
      { range: { age: { gte: num } } },
    ]);
  });

  it('should parse Lt', () => {
    const num = faker.datatype.number();

    expect(getSearchFilter(null, { ageLt: num }).must).toEqual([
      { range: { age: { lt: num } } },
    ]);
  });

  it('should parse Lte', () => {
    const num = faker.datatype.number();

    expect(getSearchFilter(null, { ageLte: num }).must).toEqual([
      { range: { age: { lte: num } } },
    ]);
  });

  it('should parse isNull', () => {
    expect(getSearchFilter(null, { statusIsNull: true }).must_not).toEqual([
      { exists: { field: 'status' } },
    ]);
    expect(getSearchFilter(null, { statusIsNull: false }).must).toEqual([
      { exists: { field: 'status' } },
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

    expect(getSearchFilter(query, { name, idIn, ageLte }).must).toEqual([
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
