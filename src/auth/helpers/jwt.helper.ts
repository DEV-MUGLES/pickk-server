import { UnauthorizedException } from '@nestjs/common';

import { JwtPayload } from '../models';

const _atob = (input: string): string =>
  Buffer.from(input, 'base64').toString();

/** extract JwtPayload from given authorization header */
export const extractJwtPayload = (authorization: string): JwtPayload => {
  if (!authorization) {
    throw new UnauthorizedException('Authorization Header Not Given');
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    throw new UnauthorizedException('Token Not Given');
  }

  const payload = JSON.parse(_atob(token.split('.')[1]));
  if (!payload.sub) {
    throw new UnauthorizedException('Invalid Token provided');
  }

  return new JwtPayload(payload);
};
