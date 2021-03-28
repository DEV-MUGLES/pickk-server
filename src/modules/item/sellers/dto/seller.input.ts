import { Field, InputType, Int, OmitType, PickType } from '@nestjs/graphql';

import { FindSaleStrategyInput } from '@src/common/dto/sale-strategy.input';

import { SellerShippingPolicy } from '../models/policies/seller-shipping-policy.model';
import { Seller } from '../models/seller.model';

@InputType()
class CreateSellerShippingPolicyInput extends PickType(
  SellerShippingPolicy,
  ['minimumAmountForFree', 'fee'],
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
    'shippingPolicy',
  ],
  InputType
) {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  brandId: number;

  @Field(() => FindSaleStrategyInput)
  saleStrategyInput: FindSaleStrategyInput;

  @Field(() => CreateSellerShippingPolicyInput)
  shippingPolicyInput: CreateSellerShippingPolicyInput;
}
