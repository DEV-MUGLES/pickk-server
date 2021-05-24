import { isRegexString } from './is-regex-string';

describe('isRegexString', () => {
  it('should return true when valid', () => {
    const validInputs = ['/sumin/', '/3332255555/gi', '/3332255555/gimsuy'];

    validInputs.forEach((input) => {
      expect(isRegexString(input)).toEqual(true);
    });
  });

  it('should return false when invalid', () => {
    const invalidInputs = [
      3332255555,
      '/3332255555',
      '/3332255555/a',
      '/3332255555/gin',
      '/3332255555/gg',
      null,
      undefined,
      true,
    ];

    invalidInputs.forEach((input) => {
      expect(isRegexString(input)).toEqual(false);
    });
  });
});
