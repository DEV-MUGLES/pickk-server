import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { SaleStrategy } from '@common/models';

import { Brand } from '@item/brands/models';
import { Courier } from '@item/couriers/models';
import { User } from '@user/users/models';

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

@ObjectType()
export class Seller extends SellerEntity {
  @Field(() => User)
  @Type(() => User)
  user: User;
  @Field(() => Brand)
  @Type(() => Brand)
  brand: Brand;

  @Field(() => Courier, { nullable: true })
  @Type(() => Courier)
  courier: Courier;

  @Field(() => SaleStrategy)
  @Type(() => SaleStrategy)
  saleStrategy: SaleStrategy;
  @Field(() => SellerCrawlStrategy)
  @Type(() => SellerCrawlStrategy)
  crawlStrategy: SellerCrawlStrategy;
  @Field(() => SellerClaimPolicy)
  @Type(() => SellerClaimPolicy)
  claimPolicy: SellerClaimPolicy;
  @Field(() => SellerCrawlPolicy)
  @Type(() => SellerCrawlPolicy)
  crawlPolicy: SellerCrawlPolicy;
  @Field(() => SellerShippingPolicy)
  @Type(() => SellerShippingPolicy)
  shippingPolicy: SellerShippingPolicy;
  @Field(() => SellerSettlePolicy, { nullable: true })
  @Type(() => SellerSettlePolicy)
  settlePolicy?: SellerSettlePolicy;
  @Field(() => SellerReturnAddress)
  @Type(() => SellerReturnAddress)
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
