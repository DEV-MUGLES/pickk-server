import { Injectable } from '@nestjs/common';

import { SELLER_RELATIONS } from '@item/sellers/constants';
import { SellersService } from '@item/sellers/sellers.service';

import { JwtPayload } from '../models';

import { BaseStrategy } from './base.strategy';

@Injectable()
export class SellerStrategy extends BaseStrategy('seller') {
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
