import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { CouponStatus } from '../constants';
import { ICoupon } from '../interfaces';

@InputType()
export class CouponFilter implements Partial<ICoupon> {
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  userId?: number;

  @Field(() => CouponStatus, {
    nullable: true,
  })
  @IsEnum(CouponStatus)
  @IsOptional()
  status?: CouponStatus;
}
