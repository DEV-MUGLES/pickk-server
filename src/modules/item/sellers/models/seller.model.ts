import { Field, ObjectType } from '@nestjs/graphql';

import { SaleStrategy } from '@common/models';

import { Brand } from '@item/brands/models';

import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerSettlePolicyInput,
} from '../dtos';
import { SellerEntity } from '../entities';

import {
  SellerClaimPolicy,
  SellerCrawlPolicy,
  SellerSettleAccount,
  SellerSettlePolicy,
  SellerShippingPolicy,
} from './policies';
import { SellerCrawlStrategy } from './seller-crawl-strategy.model';
import { SellerReturnAddress } from './seller-return-address.model';
import { User } from '@user/users/models';
import { Courier } from '@item/couriers/models';

@ObjectType()
export class Seller extends SellerEntity {
  @Field(() => User)
  user: User;
  @Field(() => Brand)
  brand: Brand;

  @Field(() => Courier, { nullable: true })
  courier: Courier;

  @Field(() => SaleStrategy)
  saleStrategy: SaleStrategy;
  @Field(() => SellerCrawlStrategy)
  crawlStrategy: SellerCrawlStrategy;
  @Field(() => SellerClaimPolicy)
  claimPolicy: SellerClaimPolicy;
  @Field(() => SellerCrawlPolicy)
  crawlPolicy: SellerCrawlPolicy;
  @Field(() => SellerShippingPolicy)
  shippingPolicy: SellerShippingPolicy;
  @Field(() => SellerSettlePolicy, { nullable: true })
  settlePolicy?: SellerSettlePolicy;
  @Field(() => SellerReturnAddress)
  returnAddress: SellerReturnAddress;

  updateClaimPolicy(input: UpdateSellerClaimPolicyInput): SellerClaimPolicy {
    this.claimPolicy = new SellerClaimPolicy({
      ...this.claimPolicy,
      ...input,
    });
    return this.claimPolicy;
  }

  updateSettlePolicy(input: UpdateSellerSettlePolicyInput): SellerSettlePolicy {
    const { accountInput, ...settlePolicyAttributes } = input;
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
