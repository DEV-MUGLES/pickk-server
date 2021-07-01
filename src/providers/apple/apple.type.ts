export type AppleTokenResponse = {
  access_token: string;

  expires_in: string;

  id_token: string;

  refresh_token: string;

  token_type: 'bearer';
};

export type AppleJwk = {
  /** 토큰에 사용된 암호화 알고리즘 */
  alg: string;

  /** The exponent value for the RSA public key. */
  e: string;

  /** A 10-character identifier key, obtained from your developer account. */
  kid: string;

  /** The key type parameter setting. This must be set to "RSA". */
  kty: 'RSA';

  /** The modulus value for the RSA public key */
  n: string;

  /** The intended use for the public key. */
  use: string;
};
