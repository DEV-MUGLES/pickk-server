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

  private checkExpireAt(): boolean {
    return dayjs().isBefore(this.spec.expireAt);
  }

  private checkStatus(): boolean {
    return this.status === CouponStatus.Ready;
  }

  private checkMinimumFotUse(finalPrice: number): boolean {
    return finalPrice >= this.spec.minimumForUse;
  }

  private checkBrand(itemBrandId: number): boolean {
    if (!this.spec.brandId) {
      return true;
    }
    return this.spec.brandId === itemBrandId;
  }

  public checkUsableOn(item: Item): boolean {
    const { finalPrice, brandId } = item;

    return (
      this.checkStatus() &&
      this.checkExpireAt() &&
      this.checkMinimumFotUse(finalPrice) &&
      this.checkBrand(brandId)
    );
  }
}
