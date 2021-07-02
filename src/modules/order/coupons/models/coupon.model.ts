import dayjs from 'dayjs';
import { ObjectType } from '@nestjs/graphql';

import { CouponEntity } from '../entities/coupon.entity';
import { CouponStatus } from '../constants/coupon.enum';
import { Item } from '@item/items/models/item.model';

@ObjectType()
export class Coupon extends CouponEntity {
  constructor(attributes?: Partial<Coupon>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.spec = attributes.spec;
    this.specId = attributes.specId;
    this.status = attributes.status;
  }

  public checkUsableOn(item: Item): boolean {
    const {
      status,
      spec: { minimumForUse, brandId, expireAt },
    } = this;
    const { finalPrice, brandId: itemBrandId } = item;
    if (status !== CouponStatus.Ready || dayjs().isAfter(expireAt)) {
      return false;
    }

    if (finalPrice < minimumForUse && brandId && brandId !== itemBrandId) {
      return false;
    }

    return true;
  }
}
