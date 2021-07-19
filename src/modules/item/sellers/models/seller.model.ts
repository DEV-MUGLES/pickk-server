import { Field, ObjectType } from '@nestjs/graphql';

import { Brand } from '@item/brands/models';
import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerSettlePolicyInput,
} from '../dtos';
import { SellerEntity } from '../entities';
import {
  SellerClaimAccount,
  SellerClaimPolicy,
  SellerSettleAccount,
  SellerSettlePolicy,
} from './policies';

@ObjectType()
export class Seller extends SellerEntity {
  @Field(() => Brand)
  brand: Brand;

  public updateClaimPolicy?(
    claimPolicyInput: UpdateSellerClaimPolicyInput
  ): SellerClaimPolicy {
    const { accountInput, ...claimPolicyAttributes } = claimPolicyInput;
    const isAddingAccount = this.claimPolicy.account || accountInput;

    this.claimPolicy = new SellerClaimPolicy({
      ...this.claimPolicy,
      ...claimPolicyAttributes,
      account: isAddingAccount
        ? new SellerClaimAccount({
            ...this.claimPolicy.account,
            ...accountInput,
          })
        : null,
    });
    return this.claimPolicy;
  }

  public updateSettlePolicy?(
    settlePolicyInput: UpdateSellerSettlePolicyInput
  ): SellerSettlePolicy {
    const { accountInput, ...settlePolicyAttributes } = settlePolicyInput;
    const isAddingAccount = this.settlePolicy?.account || accountInput;

    this.settlePolicy = new SellerSettlePolicy({
      ...this.settlePolicy,
      ...settlePolicyAttributes,
      account: isAddingAccount
        ? new SellerSettleAccount({
            ...this.settlePolicy?.account,
            ...accountInput,
          })
        : null,
    });
    return this.settlePolicy;
  }
}
