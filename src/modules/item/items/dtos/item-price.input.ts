import { InputType, PickType } from '@nestjs/graphql';

import { ItemPrice } from '../models/item-price.model';

@InputType()
export class AddItemPriceInput extends PickType(
  ItemPrice,
  [
    'originalPrice',
    'sellPrice',
    'finalPrice',
    'pickkDiscountAmount',
    'pickkDiscountRate',
    'isActive',
    'isBase',
    'isCrawlUpdating',
    'startAt',
    'endAt',
    'displayPrice',
    'unit',
  ],
  InputType
) {}

@InputType()
export class UpdateItemPriceInput extends PickType(
  ItemPrice,
  [
    'originalPrice',
    'sellPrice',
    'finalPrice',
    'pickkDiscountAmount',
    'pickkDiscountRate',
    'isCrawlUpdating',
    'startAt',
    'endAt',
    'displayPrice',
    'unit',
  ],
  InputType
) {}
