import { IBaseId } from '@common/interfaces';

import { IBrand } from '@item/brands/interfaces';

import { CouponType } from '../constants';

export interface ICouponSpecification extends IBaseId {
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
