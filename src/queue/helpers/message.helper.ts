/**
 *
 * @param input message id로 변환할 문자열입니다.
 * @returns SQS Message id 문자열 규칙에 맞게 parsing합니다.
 */
export function parse2MessageId(input: string) {
  const invalidIdPattern =
    /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi;
  return input.replace(invalidIdPattern, '').slice(0, 80);
}
