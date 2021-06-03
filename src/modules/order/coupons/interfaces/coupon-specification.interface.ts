import { IBrand } from '@src/modules/item/brands/interfaces/brand.interface';
import { CouponType } from '../constants/coupon.enum';

export interface ICouponSpecification {
  brand?: IBrand;
  brandId?: number;

  name: string;
  type: CouponType;

  discountRate?: number;
  discountAmount?: number;

  minimumForUse?: number;
  maximumDiscountPrice?: number;

  availableAt?: Date;
  expireAt: Date;
}
