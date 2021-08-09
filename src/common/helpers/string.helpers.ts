import { isRegexString } from '@common/decorators';

/**
 * regexString을 입력 받아 pattern, flag를 반환합니다.
 * @param regexString
 * @return 추출한 pattern과 flag를 반환합니다.
 */
export const splitRegexString = (regexString: string): [string, string] => {
  if (!isRegexString(regexString)) {
    return [null, null];
  }

  const lastSlashIndex = regexString.lastIndexOf('/');
  const pattern = regexString.slice(1, lastSlashIndex);
  const flag =
    lastSlashIndex < regexString.length - 1
      ? regexString.slice(lastSlashIndex + 1)
      : '';

  return [pattern, flag];
};
