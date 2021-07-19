import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { ICoupon } from '../interfaces';

@InputType()
export class CouponFilter implements Partial<ICoupon> {
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  userId?: number;
}
