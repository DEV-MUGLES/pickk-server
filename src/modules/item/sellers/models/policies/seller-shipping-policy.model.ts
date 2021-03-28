import { ObjectType } from '@nestjs/graphql';
import { SellerShippingPolicyEntity } from '../../entities/policies/seller-shipping-policy.entity';

@ObjectType()
export class SellerShippingPolicy extends SellerShippingPolicyEntity {
  constructor(attributes?: Partial<SellerShippingPolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.minimumAmountForFree = attributes.minimumAmountForFree;
    this.fee = attributes.fee;
  }
}
