import { ForbiddenException, Injectable } from '@nestjs/common';

import { JwtPayload } from '../models';

import { BaseStrategy } from './base.strategy';

@Injectable()
export class SellerVerifyStrategy extends BaseStrategy('seller-verify') {
  async validate(payload: JwtPayload) {
    if (!payload.sellerId || !payload.brandId) {
      throw new ForbiddenException('Seller token이 아닙니다.');
    }

    return payload;
  }
}
