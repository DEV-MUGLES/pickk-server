import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { jwtConstants } from '@auth/constants';

export const BaseStrategy = (
  name?: string,
  secretOrKey: string = jwtConstants.secret
) =>
  class Result extends PassportStrategy(Strategy, name) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey,
      });
    }
  };
