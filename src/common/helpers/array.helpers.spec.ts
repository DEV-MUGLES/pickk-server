import { isAllEleSame } from './array.helpers';

describe('isAllEleSame', () => {
  it('success', () => {
    const validInputs = [
      [null, null, null],
      [0, 0],
      [1],
      ['a', 'a', 'a', 'a', 'a'],
      [],
    ];

    validInputs.forEach((input) => {
      expect(isAllEleSame(input)).toEqual(true);
    });
  });

  it('fail', () => {
    const validInputs = [
      [null, undefined, null],
      [0, 1],
      ['a', 'a', 'a', 'a', 'b'],
      [false, true],
    ];

    validInputs.forEach((input) => {
      expect(isAllEleSame(input)).toEqual(false);
    });
  });
});
