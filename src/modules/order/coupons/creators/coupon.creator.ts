import faker from 'faker';

import { Coupon } from '../models';
import { CouponType } from '../constants';
import { CouponSpecificationCreator } from './coupon-specification.creator';

export class CouponCreator {
  static create(type?: CouponType, maximumDiscountAmountOrRate?: number) {
    return new Coupon({
      id: faker.datatype.number(10),
      spec: CouponSpecificationCreator.create(
        type ?? CouponType.Rate,
        maximumDiscountAmountOrRate
      ),
    });
  }
}
