import { ObjectType } from '@nestjs/graphql';

import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerSettlePolicyInput,
} from '../dtos/seller-policies.input';
import { SellerEntity } from '../entities/seller.entity';
import { SellerClaimAccount } from './policies/seller-claim-account.model';
import { SellerClaimPolicy } from './policies/seller-claim-policy.model';
import { SellerSettleAccount } from './policies/seller-settle-account.model';
import { SellerSettlePolicy } from './policies/seller-settle-policy.model';

@ObjectType()
export class Seller extends SellerEntity {
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
