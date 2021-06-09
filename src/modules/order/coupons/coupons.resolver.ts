import { Inject, UseGuards } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtVerifyGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';

import { COUPON_RELATIONS } from './constants/coupon.relation';
import { Coupon } from './models/coupon.model';
import { CouponsService } from './coupons.service';

@Resolver()
export class CouponsResolver extends BaseResolver<Coupon> {
  relations = COUPON_RELATIONS;

  constructor(@Inject(CouponsService) private couponsService: CouponsService) {
    super();
  }

  @Query(() => [Coupon])
  @UseGuards(JwtVerifyGuard)
  async myCoupons(
    @CurrentUser() payload: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Coupon[]> {
    return await this.couponsService.list(
      { userId: payload.sub },
      null,
      this.getRelationsFromInfo(info)
    );
  }
}
