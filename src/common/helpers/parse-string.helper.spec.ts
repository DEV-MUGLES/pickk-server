import { partialEncrypt } from './parse-string.helper';

describe('partialEncrypt', () => {
  it('성공한다.', () => {
    const testCases: [string, string][] = [
      ['sumin', 's***n'],
      ['hi', 'h*'],
      ['h', 'h'],
      ['abcdefghi', 'a***efghi'],
    ];

    testCases.forEach(([input, output]) => {
      expect(partialEncrypt(input)).toBe(output);
    });
  });

  it('먼저 trim을 적용한다.', () => {
    const testCases: [string, string][] = [
      ['   sumin ', 's***n'],
      ['h i', 'h**'],
      ['h  ', 'h'],
      ['  abcdefghi', 'a***efghi'],
    ];

    testCases.forEach(([input, output]) => {
      expect(partialEncrypt(input)).toBe(output);
    });
  });

  it('Falsy한 값이 입력된 경우 빈 문자열을 반환한다.', () => {
    const testCases: [string, string][] = [
      [null, ''],
      [undefined, ''],
      ['', ''],
    ];

    testCases.forEach(([input, output]) => {
      expect(partialEncrypt(input)).toBe(output);
    });
  });

  it('encrypt할 length를 지정할 수 있다.', () => {
    const testCases: [number, string, string][] = [
      [1, '최수민', '최*민'],
      [2, 'PAKA', 'P**A'],
    ];

    testCases.forEach(([length, input, output]) => {
      expect(partialEncrypt(input, length)).toBe(output);
    });
  });
});
