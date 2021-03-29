import { ObjectType } from '@nestjs/graphql';

import { SellerClaimPolicyEntity } from '../../entities/policies/seller-claim-policy.entity';

@ObjectType()
export class SellerClaimPolicy extends SellerClaimPolicyEntity {}
