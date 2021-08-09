import { addCommas } from './parse-number.helper';

describe('addCommas', () => {
  it('성공한다.', () => {
    const testCases: [number, string][] = [
      [298, '298'],
      [2984, '2,984'],
      [297312984, '297,312,984'],
      [1.35, '1.35'],
      [0, '0'],
      [-1000, '-1,000'],
    ];

    testCases.forEach(([input, output]) => {
      expect(addCommas(input)).toBe(output);
    });
  });

  it('falsy한 값이 들어오면 빈 문자열을 반환한다.', () => {
    const testCases: [number, string][] = [
      [null, ''],
      [undefined, ''],
    ];

    testCases.forEach(([input, output]) => {
      expect(addCommas(input)).toBe(output);
    });
  });
});
