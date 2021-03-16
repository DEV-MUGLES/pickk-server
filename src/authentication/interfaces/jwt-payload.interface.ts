export interface IJwtPayload {
  username: string;
  code?: string;
  sub: number;
  iat: number;
  exp: number;
}
