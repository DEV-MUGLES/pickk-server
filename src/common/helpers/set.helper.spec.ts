import * as faker from 'faker';

import { isEqualSet } from './set.helpers';

describe('isEqualSet', () => {
  it('같은 set에 대하여 true를 반환한다', () => {
    const arrayData = faker.datatype.array(10);
    const a = new Set(arrayData);
    const b = new Set(arrayData);

    expect(isEqualSet(a, b)).toBeTruthy();
  });
  it('다른 set에 대하여 false를 반환한다', () => {
    const a = new Set(faker.datatype.array(10));
    const b = new Set(faker.datatype.array(10));

    expect(isEqualSet(a, b)).toBeFalsy();
  });

  it('두 개의 set이 모두 falsy(null또는 undefined)이면 true를 반환한다', () => {
    expect(isEqualSet(null, null)).toBeTruthy();
    expect(isEqualSet(undefined, undefined)).toBeTruthy();
  });

  it('둘 중 하나가 falsy(null또는 undefined)이면, false를 반환한다', () => {
    expect(isEqualSet(null, new Set())).toBeFalsy();
    expect(isEqualSet(undefined, new Set())).toBeFalsy();
  });
});
