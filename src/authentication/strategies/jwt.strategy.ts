import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SELLER_RELATIONS } from '@item/sellers/constants/seller.relation';
import { SellersService } from '@item/sellers/sellers.service';
import { UsersService } from '@user/users/users.service';

import { jwtConstants, jwtRefreshConstants } from '../constants';
import { JwtPayload } from '../dtos';

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
    return this.sellersService.findOne(
      { userId: payload.sub },
      SELLER_RELATIONS
    );
  }
}
