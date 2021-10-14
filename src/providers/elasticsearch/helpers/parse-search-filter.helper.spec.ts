import * as faker from 'faker';

import { parseSearchFilter } from './parse-search-filter.helper';

describe('parseSearchFilter', () => {
  it('should return {} when filter is falsy', () => {
    expect(parseSearchFilter(null)).toEqual({});
    expect(parseSearchFilter(undefined)).toEqual({});
  });

  it('should parse In', () => {
    const strs = [faker.lorem.text(), faker.lorem.text(), faker.lorem.text()];
    const nums = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ];

    expect(parseSearchFilter({ nameIn: strs })).toEqual({
      terms: {
        name: strs,
      },
    });
    expect(parseSearchFilter({ ageIn: nums })).toEqual({
      terms: {
        age: nums,
      },
    });
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
      expect(parseSearchFilter({ nameBetween: input })).toEqual({
        range: {
          name: {
            gte: input[0],
            lte: input[1],
          },
        },
      });
    }
  });

  it('should parse Mt', () => {
    const num = faker.datatype.number();

    expect(parseSearchFilter({ ageMt: num })).toEqual({
      range: {
        age: { gt: num },
      },
    });
  });

  it('should parse Mte', () => {
    const num = faker.datatype.number();

    expect(parseSearchFilter({ ageMte: num })).toEqual({
      range: {
        age: { gte: num },
      },
    });
  });

  it('should parse Lt', () => {
    const num = faker.datatype.number();

    expect(parseSearchFilter({ ageLt: num })).toEqual({
      range: {
        age: { lt: num },
      },
    });
  });

  it('should parse Lte', () => {
    const num = faker.datatype.number();

    expect(parseSearchFilter({ ageLte: num })).toEqual({
      range: {
        age: { lte: num },
      },
    });
  });

  it('should parse Lte', () => {
    const name = faker.lorem.word();
    const idIn = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ];
    const ageLte = faker.datatype.number();

    expect(parseSearchFilter({ name, idIn, ageLte })).toEqual({
      term: { name },
      terms: { id: idIn },
      range: {
        age: { lte: ageLte },
      },
    });
  });
});
