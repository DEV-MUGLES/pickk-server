import { Field, InputType, Int, OmitType } from '@nestjs/graphql';

import { FindSaleStrategyInput } from '@src/common/dto/sale-strategy.input';

import { Seller } from '../models/seller.model';

@InputType()
export class CreateSellerInput extends OmitType(
  Seller,
  ['id', 'createdAt', 'updatedAt', 'user', 'brand', 'saleStrategy'],
  InputType
) {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  brandId: number;

  @Field(() => FindSaleStrategyInput)
  saleStrategyInput: FindSaleStrategyInput;
}
