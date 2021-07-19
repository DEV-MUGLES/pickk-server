import { InputType, PickType } from '@nestjs/graphql';

import { Coupon } from '../models';

@InputType()
export class CreateCouponInput extends PickType(
  Coupon,
  ['specId', 'userId'],
  InputType
) {}

@InputType()
export class UpdateCouponInput extends PickType(
  Coupon,
  ['status'],
  InputType
) {}
