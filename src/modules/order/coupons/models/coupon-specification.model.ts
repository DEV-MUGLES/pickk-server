import { ObjectType } from '@nestjs/graphql';

import { CouponSpecificationEntity } from '../entities';

@ObjectType()
export class CouponSpecification extends CouponSpecificationEntity {}
