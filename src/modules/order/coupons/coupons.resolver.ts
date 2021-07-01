import { Inject, UseGuards, ForbiddenException } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtAuthGuard, JwtVerifyGuard } from '@auth/guards';
import { Roles } from '@auth/decorators/roles.decorator';
import { BaseResolver } from '@common/base.resolver';
import { SellersService } from '@item/sellers/sellers.service';
import { UserRole } from '@user/users/constants/user.enum';
import { User } from '@user/users/models';

import {
  CouponRelationType,
  COUPON_RELATIONS,
} from './constants/coupon.relation';
import { Coupon } from './models/coupon.model';
import { CouponsService } from './coupons.service';
import { CouponSpecification } from './models/coupon-specification.model';
import { CreateCouponSpecificationInput } from './dtos/coupon-specification.input';
import { CreateCouponInput } from './dtos/coupon.input';

@Resolver()
export class CouponsResolver extends BaseResolver<CouponRelationType> {
  relations = COUPON_RELATIONS;

  constructor(
    @Inject(CouponsService) private couponsService: CouponsService,
    @Inject(SellersService) private sellersService: SellersService
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
