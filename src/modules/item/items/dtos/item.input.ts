import { InputType, PickType, PartialType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { IItem } from '../interfaces/item.interface';

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
export class BulkUpdateItemInput implements Partial<IItem> {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isMdRecommended: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isSellable: boolean;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  majorCategoryId: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  minorCategoryId: number;

  sellableAt?: Date;
}
