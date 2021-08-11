import { splitRegexString } from './regex.helpers';

describe('splitRegexString', () => {
  it('성공적으로 pattern과 flag를 반환한다', () => {
    const testPattern = 'testPattern(d+)^*x(?!y)';
    const testFlag = 'gimsuy';

    expect(splitRegexString(`/${testPattern}/${testFlag}`)).toEqual([
      testPattern,
      testFlag,
    ]);
  });

  it('유효하지않은 정규식이 전달된 경우, null을 반환한다.', () => {
    const testPattern = 's={';
    const testFlag = 'se';

    expect(splitRegexString(`/${testPattern}/${testFlag}`)).toEqual([
      null,
      null,
    ]);
  });
});
