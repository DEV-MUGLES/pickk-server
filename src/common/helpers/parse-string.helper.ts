/** 먼저 trim하고 [1, 1 + length) 번째 문자를 *로 변경한다.
 * @param input 변경할 문자열
 * @param encryptLength 변경할 길이 (기본값 3)
 */
export const partialEncrypt = (input: string, encryptLength = 3): string => {
  if (!input) {
    return '';
  }

  const trimed = input.trim();

  if (trimed.length <= 1) {
    return trimed;
  }

  const start = 1;
  const end = start + encryptLength;

  return (
    trimed[0] + trimed.slice(start, end).replace(/./g, '*') + trimed.slice(end)
  );
};
