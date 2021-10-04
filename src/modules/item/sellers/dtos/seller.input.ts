import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';

import { Seller } from '../models';
import {
  CreateSellerClaimPolicyInput,
  CreateSellerCrawlPolicyInput,
  CreateSellerShippingPolicyInput,
  CreateSellerReturnAddressInput,
  CreateSellerCrawlStrategyInput,
  CreateSellerSettlePolicyInput,
  CreateSellerSaleStrategyInput,
} from './seller-policies.input';

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

  @Field()
  saleStrategyInput: CreateSellerSaleStrategyInput;
  @Field()
  crawlStrategyInput: CreateSellerCrawlStrategyInput;

  @Field()
  claimPolicyInput: CreateSellerClaimPolicyInput;
  @Field()
  crawlPolicyInput: CreateSellerCrawlPolicyInput;
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
