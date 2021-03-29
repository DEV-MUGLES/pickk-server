import {
  Field,
  InputType,
  Int,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { FindSaleStrategyInput } from '@src/common/dto/sale-strategy.input';

import {
  CreateSellerClaimPolicyInput,
  CreateSellerCrawlPolicyInput,
  CreateSellerShippingPolicyInput,
  CreateSellerReturnAddressInput,
} from './seller-policies.input';
import { Seller } from '../models/seller.model';

@InputType()
export class CreateSellerInput extends OmitType(
  Seller,
  [
    'id',
    'createdAt',
    'updatedAt',
    'user',
    'brand',
    'saleStrategy',
    'claimPolicy',
    'crawlPolicy',
    'shippingPolicy',
    'returnAddress',
  ],
  InputType
) {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  brandId: number;

  @Field(() => FindSaleStrategyInput)
  saleStrategyInput: FindSaleStrategyInput;

  @Field()
  claimPolicyInput: CreateSellerClaimPolicyInput;

  @Field()
  crawlPolicyInput: CreateSellerCrawlPolicyInput;

  @Field()
  shippingPolicyInput: CreateSellerShippingPolicyInput;

  @Field()
  returnAddressInput: CreateSellerReturnAddressInput;
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
    ],
    InputType
  )
) {}
