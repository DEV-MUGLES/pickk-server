import { InputType, PickType, PartialType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { ItemInfoCrawlResult } from '@providers/crawler';

import { IItem } from '../interfaces';
import { Item } from '../models';

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

  constructor(attributes: Partial<CreateItemInput>) {
    super();
    Object.assign(this, attributes);
  }

  static create(v: ItemInfoCrawlResult) {
    return new CreateItemInput({
      name: v.name,
      imageUrl: v.imageUrl,
      isMdRecommended: false,
      isSellable: false,
      urlInput: {
        isPrimary: true,
        url: v.url,
      },
      priceInput: {
        originalPrice: v.originalPrice,
        sellPrice: v.salePrice,
        isCrawlUpdating: true,
      },
    });
  }
}

@InputType()
export class UpdateItemInput extends PartialType(
  PickType(
    Item,
    [
      'name',
      'description',
      'imageUrl',
      'description',
      'majorCategoryId',
      'minorCategoryId',
      'isInfiniteStock',
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
