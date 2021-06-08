export interface IJwtPayload {
  nickname: string;
  code?: string;
  sub: number;
  iat: number;
  exp: number;
}
