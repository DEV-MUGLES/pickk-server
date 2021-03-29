import {
  Field,
  InputType,
  Int,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { FindSaleStrategyInput } from '@src/common/dto/sale-strategy.input';

import { SellerClaimPolicy } from '../models/policies/seller-claim-policy.model';
import { SellerCrawlPolicy } from '../models/policies/seller-crawl-policy.model';
import { SellerShippingPolicy } from '../models/policies/seller-shipping-policy.model';
import { SellerReturnAddress } from '../models/seller-return-address.model';
import { Seller } from '../models/seller.model';

@InputType()
class CreateSellerCrawlPolicyInput extends PickType(
  SellerCrawlPolicy,
  ['isInspectingNew', 'isUpdatingSaleItemInfo'],
  InputType
) {}

@InputType()
class CreateSellerClaimPolicyInput extends PickType(
  SellerClaimPolicy,
  ['fee', 'phoneNumber', 'picName'],
  InputType
) {}

@InputType()
class CreateSellerShippingPolicyInput extends PickType(
  SellerShippingPolicy,
  ['minimumAmountForFree', 'fee'],
  InputType
) {}

@InputType()
class CreateSellerReturnAddressInput extends PickType(
  SellerReturnAddress,
  ['baseAddress', 'detailAddress', 'postalCode'],
  InputType
) {}

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
