import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { CouponType } from '../constants/coupon.enum';
import { ICouponSpecification } from '../interfaces/coupon-specification.interface';

@InputType()
export class CouponSpecificationFilter
  implements Partial<ICouponSpecification>
{
  @Field({ nullable: true })
  @IsOptional()
  expireAtLte?: Date;

  @Field(() => CouponType, { nullable: true })
  @IsEnum(CouponType)
  @IsOptional()
  type?: CouponType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  brandId?: number;
}
