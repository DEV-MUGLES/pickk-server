import { UseGuards, ForbiddenException } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtAuthGuard, JwtVerifyGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { SellersService } from '@item/sellers/sellers.service';
import { UserRole } from '@user/users/constants';
import { User } from '@user/users/models';

import { CouponRelationType, COUPON_RELATIONS } from './constants';
import { CreateCouponInput, CreateCouponSpecificationInput } from './dtos';
import { Coupon, CouponSpecification } from './models';
import { CouponsService } from './coupons.service';

@Resolver()
export class CouponsResolver extends BaseResolver<CouponRelationType> {
  relations = COUPON_RELATIONS;

  constructor(
    private couponsService: CouponsService,
    private sellersService: SellersService
  ) {
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

  @Roles(UserRole.Seller)
  @Mutation(() => CouponSpecification)
  @UseGuards(JwtAuthGuard)
  async createCouponSpecification(
    @CurrentUser() user: User,
    @Args('createCouponSpecificationInput')
    createCouponSpecificationInput: CreateCouponSpecificationInput
  ): Promise<CouponSpecification> {
    const { brandId } = createCouponSpecificationInput;
    if (user.role === UserRole.Seller) {
      const seller = await this.sellersService.findOne({ userId: user.id });
      if (brandId !== seller.brandId) {
        throw new ForbiddenException(
          '자신의 브랜드의 쿠폰만 생성할 수 있습니다.'
        );
      }
    }
    return await this.couponsService.createSpecification(
      createCouponSpecificationInput
    );
  }

  @Mutation(() => Coupon)
  @UseGuards(JwtVerifyGuard)
  async createCoupon(
    @CurrentUser() payload: JwtPayload,
    @Args('createCouponInput') createCouponInput: CreateCouponInput
  ): Promise<Coupon> {
    return await this.couponsService.create({
      ...createCouponInput,
      userId: payload.sub,
    });
  }
}
