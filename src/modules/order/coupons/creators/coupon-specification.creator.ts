import faker from 'faker';

import { getRandomIntBetween } from '@common/helpers';

import { CouponType } from '../constants';
import { CouponSpecification } from '../models';

export class CouponSpecificationCreator {
  static create(type: CouponType, maximumDiscountAmountOrRate?: number) {
    const result = new CouponSpecification({
      type,
      id: faker.datatype.number(100),
      name: 'couponSpec' + faker.datatype.string(10),
      maximumDiscountPrice: getRandomIntBetween(30000, 50000),
      minimumForUse: getRandomIntBetween(1000, 3000),
    });
    if (type === CouponType.Amount) {
      result.discountAmount = getRandomIntBetween(
        0,
        maximumDiscountAmountOrRate ?? 5000
      );
    }
    if (type === CouponType.Rate) {
      result.discountRate = getRandomIntBetween(
        0,
        maximumDiscountAmountOrRate ?? 30
      );
    }
    return result;
  }
}
