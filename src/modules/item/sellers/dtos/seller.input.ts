import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';

import { FindSaleStrategyInput } from '@src/common/dtos/sale-strategy.input';

import {
  CreateSellerClaimPolicyInput,
  CreateSellerCrawlPolicyInput,
  CreateSellerShippingPolicyInput,
  CreateSellerReturnAddressInput,
  CreateSellerCrawlStrategyInput,
  CreateSellerSettlePolicyInput,
} from './seller-policies.input';
import { Seller } from '../models/seller.model';

@InputType()
export class CreateSellerInput extends PickType(
  Seller,
  [
    'businessName',
    'businessCode',
    'mailOrderBusinessCode',
    'representativeName',
    'email',
    'orderNotiPhoneNumber',
    'csNotiPhoneNumber',
    'phoneNumber',
    'operationTimeMessage',
    'kakaoTalkCode',
  ],
  InputType
) {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  brandId: number;

  @Field(() => Int)
  courierId: number;

  @Field(() => FindSaleStrategyInput)
  saleStrategyInput: FindSaleStrategyInput;

  @Field()
  claimPolicyInput: CreateSellerClaimPolicyInput;

  @Field()
  crawlPolicyInput: CreateSellerCrawlPolicyInput;

  @Field()
  crawlStrategyInput: CreateSellerCrawlStrategyInput;

  @Field()
  shippingPolicyInput: CreateSellerShippingPolicyInput;

  @Field()
  returnAddressInput: CreateSellerReturnAddressInput;

  @Field({ nullable: true })
  settlePolicyInput?: CreateSellerSettlePolicyInput;
}

@InputType()
export class UpdateSellerInput extends PartialType(
  PickType(
    Seller,
    [
      'businessName',
      'businessCode',
      'mailOrderBusinessCode',
      'representativeName',
      'phoneNumber',
      'email',
      'kakaoTalkCode',
      'operationTimeMessage',
      'orderNotiPhoneNumber',
      'csNotiPhoneNumber',
    ],
    InputType
  )
) {}
