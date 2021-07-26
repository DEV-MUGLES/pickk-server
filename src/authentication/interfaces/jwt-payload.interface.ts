export interface IJwtPayload {
  /** seller 로그인인 경우에만 발급된다. */
  sellerId?: number;
  /** seller 로그인인 경우에만 발급된다. */
  brandId?: number;
  nickname: string;
  code?: string;
  sub: number;
  iat: number;
  exp: number;
}
