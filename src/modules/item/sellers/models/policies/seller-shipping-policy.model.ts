import { ObjectType } from '@nestjs/graphql';

import { SellerShippingPolicyEntity } from '../../entities/policies';

@ObjectType()
export class SellerShippingPolicy extends SellerShippingPolicyEntity {}
