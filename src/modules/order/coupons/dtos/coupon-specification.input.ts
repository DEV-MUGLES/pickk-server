import { InputType, PickType } from '@nestjs/graphql';

import { CouponSpecification } from '../models';

@InputType()
export class CreateCouponSpecificationInput extends PickType(
  CouponSpecification,
  [
    'brandId',
    'discountAmount',
    'discountRate',
    'maximumDiscountPrice',
    'minimumForUse',
    'name',
    'type',
    'availableAt',
    'expireAt',
  ],
  InputType
) {}
