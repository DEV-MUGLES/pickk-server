import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '@src/modules/user/users/users.service';
import { SellersService } from '@src/modules/item/sellers/sellers.service';

import { jwtConstants, jwtRefreshConstants } from '../constants/jwt.constant';
import { JwtPayload } from '../dto/jwt.dto';

export const CustomJwtStrategy = (
  name?: string,
  secretOrKey: string = jwtConstants.secret
) =>
  class ResultStrategy extends PassportStrategy(Strategy, name) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey,
      });
    }
  };

@Injectable()
export class JwtStrategy extends CustomJwtStrategy() {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(payload: JwtPayload) {
    return this.usersService.get(payload.sub);
  }
}

@Injectable()
export class JwtVerifyStrategy extends CustomJwtStrategy('jwt-verify') {
  async validate(payload: JwtPayload) {
    return payload;
  }
}

@Injectable()
export class JwtRefreshStrategy extends CustomJwtStrategy(
  'jwt-refresh',
  jwtRefreshConstants.secret
) {
  constructor() {
    super();
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}

@Injectable()
export class JwtSellerStrategy extends CustomJwtStrategy('jwt-seller') {
  constructor(private sellersService: SellersService) {
    super();
  }

  async validate(payload: JwtPayload) {
    return this.sellersService.findOne({ userId: payload.sub }, [
      'user',
      'brand',
      'saleStrategy',
      'claimPolicy',
      'crawlPolicy',
      'shippingPolicy',
    ]);
  }
}
