import { Coupon } from '../models/coupon.model';

export type CouponRelationType =
  | keyof Coupon
  | 'spec.brand'
  | 'user.shippingAddresses';

export const COUPON_RELATIONS: Array<CouponRelationType> = [
  'user',
  'user.shippingAddresses',
  'spec',
  'spec.brand',
];
