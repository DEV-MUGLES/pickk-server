import { IBrand } from '@item/brands/interfaces';

import { CouponType } from '../constants';

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
