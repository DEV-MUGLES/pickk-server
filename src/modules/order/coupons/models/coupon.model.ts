import { ObjectType } from '@nestjs/graphql';
import dayjs from 'dayjs';

import { Item } from '@item/items/models';

import { CouponStatus } from '../constants';
import { CouponEntity } from '../entities';

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

    if (finalPrice < minimumForUse || (brandId && brandId !== itemBrandId)) {
      return false;
    }

    return true;
  }
}
