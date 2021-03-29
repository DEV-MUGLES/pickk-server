import { ObjectType } from '@nestjs/graphql';

import { SellerClaimPolicyEntity } from '../../entities/policies/seller-claim-policy.entity';

@ObjectType()
export class SellerClaimPolicy extends SellerClaimPolicyEntity {
  constructor(attributes?: Partial<SellerClaimPolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.fee = attributes.fee;
    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
  }
}
