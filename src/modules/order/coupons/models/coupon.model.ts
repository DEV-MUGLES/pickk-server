import { ObjectType } from '@nestjs/graphql';

import { CouponEntity } from '../entities/coupon.entity';

@ObjectType()
export class Coupon extends CouponEntity {}
