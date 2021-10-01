import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import dayjs from 'dayjs';

import { Item } from '@item/items/models';
import { User } from '@user/users/models';

import { CouponStatus, CouponType } from '../constants';
import { CouponEntity } from '../entities';

import { CouponSpecification } from './coupon-specification.model';

@ObjectType()
export class Coupon extends CouponEntity {
  @Field(() => User)
  @Type(() => User)
  user: User;
  @Field(() => CouponSpecification, { nullable: true })
  @Type(() => CouponSpecification)
  spec: CouponSpecification;

  public checkUsableOn(item: Item): boolean {
    const {
      status,
      spec: { minimumForUse, brandId, expireAt },
    } = this;
    const { finalPrice, brandId: itemBrandId } = item;
    if (status !== CouponStatus.Ready || dayjs().isAfter(expireAt)) {
      return false;
    }

    if (finalPrice < minimumForUse || (brandId && brandId !== itemBrandId)) {
      return false;
    }

    return true;
  }

  public getDiscountAmountFor(item: Item): number {
    const { min, ceil } = Math;

    const {
      spec: { type, maximumDiscountPrice, discountAmount },
    } = this;
    if (type === CouponType.Rate) {
      return min(
        maximumDiscountPrice,
        ceil((item.finalPrice * this.spec.discountRate) / 100)
      );
    } else {
      return min(maximumDiscountPrice, discountAmount);
    }
  }
}
