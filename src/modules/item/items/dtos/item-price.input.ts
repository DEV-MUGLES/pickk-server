import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';

import { ItemPrice } from '../models';

@InputType()
export class AddItemPriceInput extends PickType(
  ItemPrice,
  [
    'originalPrice',
    'sellPrice',
    'pickkDiscountAmount',
    'pickkDiscountRate',
    'isCrawlUpdating',
    'startAt',
    'endAt',
  ],
  InputType
) {
  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateItemPriceInput extends PartialType(
  PickType(
    ItemPrice,
    [
      'originalPrice',
      'sellPrice',
      'pickkDiscountAmount',
      'pickkDiscountRate',
      'isCrawlUpdating',
      'startAt',
      'endAt',
      'displayPrice',
      'unit',
    ],
    InputType
  )
) {}
