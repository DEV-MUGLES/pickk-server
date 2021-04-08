import { isBusinessCode } from './is-business-code';

describe('isBusinessCode', () => {
  it('should return true when valid', () => {
    const validInputs = ['333-22-55555', '123-22-51231'];

    validInputs.forEach((input) => {
      expect(isBusinessCode(input)).toEqual(true);
    });
  });

  it('should return false when invalid', () => {
    const invalidInputs = [3332255555, '3332255555', null, undefined, true];

    invalidInputs.forEach((input) => {
      expect(isBusinessCode(input)).toEqual(false);
    });
  });
});
