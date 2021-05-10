import { Field, ObjectType } from '@nestjs/graphql';

import { AddItemUrlInput } from '../dtos/item-url.input';
import { ItemEntity } from '../entities/item.entity';
import { ItemDetailImage } from './item-detail-image.model';
import { ItemOption } from './item-option.model';
import { ItemUrl } from './item-url.model';
import { Product } from '../../products/models/product.model';
import { ItemPrice } from './item-price.model';
import { AddItemPriceInput } from '../dtos/item-price.input';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@ObjectType()
export class Item extends ItemEntity {
  @Field(() => [ItemPrice])
  prices: ItemPrice[];

  @Field(() => [ItemUrl])
  urls: ItemUrl[];

  @Field(() => [ItemDetailImage], { nullable: true })
  detailImages: ItemDetailImage[];

  @Field(() => [ItemOption], {
    nullable: true,
  })
  options: ItemOption[];

  @Field(() => [Product], {
    nullable: true,
  })
  products: Product[];

  @Field()
  get originalPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).originalPrice;
  }

  @Field()
  get salePrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).originalPrice;
  }

  @Field()
  get finalPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).originalPrice;
  }

  private setPrimaryUrl = (index: number): void => {
    this.urls.forEach((url, _index) => {
      url.isPrimary = _index === index;
    });
  };

  private setActivePrice = (index: number): void => {
    this.prices.forEach((price, _index) => {
      price.isActive = _index === index;
    });
  };

  public addUrl = (addItemUrlInput: AddItemUrlInput): ItemUrl => {
    const itemUrl = new ItemUrl(addItemUrlInput);
    this.urls = (this.urls ?? []).concat(itemUrl);
    if (addItemUrlInput.isPrimary || this.urls.length === 1) {
      this.setPrimaryUrl(this.urls.length - 1);
    }
    return itemUrl;
  };

  public addPrice = (addItemPriceInput: AddItemPriceInput): ItemPrice => {
    const itemPrice = new ItemPrice(addItemPriceInput);
    this.prices = (this.prices ?? []).concat(itemPrice);
    if (addItemPriceInput.isActive || this.prices.length === 1) {
      this.setActivePrice(this.prices.length - 1);
    }
    return itemPrice;
  };

  public removePrice = (priceId: number): ItemPrice => {
    const index = this.prices.findIndex(({ id }) => id === priceId);
    if (index < 0) {
      throw new NotFoundException('ItemPrice Not Found!');
    }
    const itemPrice = this.prices[index];

    if (itemPrice.isBase) {
      throw new BadRequestException('Cannot remove base ItemPrice');
    }

    this.prices = [
      ...this.prices.slice(0, index),
      ...this.prices.slice(index + 1),
    ];

    return itemPrice;
  };
}
