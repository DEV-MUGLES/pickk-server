import { ObjectType } from '@nestjs/graphql';

import { SellerSettlePolicyEntity } from '../../entities/policies';

@ObjectType()
export class SellerSettlePolicy extends SellerSettlePolicyEntity {}
