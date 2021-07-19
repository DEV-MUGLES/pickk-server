import { ObjectType } from '@nestjs/graphql';

import { SellerClaimPolicyEntity } from '../../entities/policies';

@ObjectType()
export class SellerClaimPolicy extends SellerClaimPolicyEntity {}
