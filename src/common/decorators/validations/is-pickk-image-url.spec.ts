import { isPickkImageUrl } from './is-pickk-image-url';

describe('isPickkImageUrl', () => {
  const baseUrl = 'undefined';

  it('should return true when valid', () => {
    const validInputs = [
      baseUrl + 'sumin.jpg',
      baseUrl + 'su.min.png',
      baseUrl + 'sumin.jpeg',
      baseUrl + 'sumin.bmp',
      baseUrl + 'sumin.gif',
      baseUrl + 'sumin.svg',
    ];

    validInputs.forEach((input) => {
      expect(isPickkImageUrl(input)).toEqual(true);
    });
  });

  it('should return false when invalid', () => {
    const invalidInputs = [
      3332255555,
      'sumin.jpg',
      'https://naver.com/sumin.jpg',
      null,
      undefined,
      true,
    ];

    invalidInputs.forEach((input) => {
      expect(isPickkImageUrl(input)).toEqual(false);
    });
  });
});
