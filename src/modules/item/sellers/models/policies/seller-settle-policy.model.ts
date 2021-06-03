import { ObjectType } from '@nestjs/graphql';

import { SellerSettlePolicyEntity } from '../../entities/policies/seller-settle-policy.entity';

@ObjectType()
export class SellerSettlePolicy extends SellerSettlePolicyEntity {}
