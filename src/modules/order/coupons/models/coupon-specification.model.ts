import { ObjectType } from '@nestjs/graphql';

import { CouponSpecificationEntity } from '../entities/coupon-specification.entity';

@ObjectType()
export class CouponSpecification extends CouponSpecificationEntity {}
