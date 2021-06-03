import { Field, InputType, Int } from '@nestjs/graphql';

import { ICoupon } from '../interfaces/coupon.interface';

@InputType()
export class CouponFilter implements Partial<ICoupon> {
  @Field(() => Int, {
    nullable: true,
  })
  userId: number;
}
