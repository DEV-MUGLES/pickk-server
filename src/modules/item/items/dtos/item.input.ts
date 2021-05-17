import { InputType, PickType, PartialType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

import { Item } from '../models/item.model';
import { AddItemPriceInput } from './item-price.input';
import { AddItemUrlInput } from './item-url.input';

@InputType()
export class CreateItemInput extends PickType(
  Item,
  [
    'name',
    'imageUrl',
    'description',
    'providedCode',
    'brandId',
    'majorCategoryId',
    'minorCategoryId',
    'isMdRecommended',
    'isSellable',
  ],
  InputType
) {
  @Field(() => AddItemPriceInput)
  priceInput: AddItemPriceInput;

  @Field(() => AddItemUrlInput)
  urlInput: AddItemUrlInput;
}

@InputType()
export class UpdateItemInput extends PartialType(
  PickType(
    Item,
    [
      'name',
      'description',
      'majorCategoryId',
      'minorCategoryId',
      'isMdRecommended',
      'isSellable',
    ],
    InputType
  )
) {}

@InputType()
export class BulkUpdateItemInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isMdRecommended: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isSellable: boolean;
}
