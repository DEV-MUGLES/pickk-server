import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { AddItemUrlInput } from '../dtos/item-url.input';
import { CreateItemOptionInput } from '../dtos/item-option.input';
import { ItemEntity } from '../entities/item.entity';
import { ItemDetailImage } from './item-detail-image.model';
import { ItemOption } from './item-option.model';
import { ItemUrl } from './item-url.model';
import { Product } from '../../products/models/product.model';
import { ItemPrice } from './item-price.model';
import { AddItemPriceInput } from '../dtos/item-price.input';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from '../dtos/item-notice.input';
import { ItemNotice } from './item-notice.model';
import { ItemOptionValue } from './item-option-value.model';

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
    if (itemPrice.isActive) {
      const baseIndex = this.prices.findIndex(({ isBase }) => isBase);
      this.setActivePrice(baseIndex);
    }

    this.prices = [
      ...this.prices.slice(0, index),
      ...this.prices.slice(index + 1),
    ];

    return itemPrice;
  };

  public activatePrice = (priceId: number): ItemPrice[] => {
    const index = this.prices?.findIndex(({ id }) => id === priceId);
    if (index < 0) {
      throw new NotFoundException('해당 ItemPrice가 존재하지 않습니다.');
    }
    if (this.prices[index].isActive) {
      throw new ConflictException('이미 활성화된 Price입니다.');
    }

    this.setActivePrice(index);
    return this.prices;
  };

  public addNotice = (addItemNoticeInput: AddItemNoticeInput): ItemNotice => {
    if (this.notice) {
      throw new ConflictException('이미 안내 메세지가 존재합니다.');
    }

    const itemNotice = new ItemNotice(addItemNoticeInput);
    this.notice = itemNotice;

    return this.notice;
  };

  public updateNotice = (
    updateItemNoticeInput: UpdateItemNoticeInput
  ): ItemNotice => {
    if (!this.notice) {
      throw new NotFoundException('수정할 안내가 존재하지 않습니다.');
    }

    this.notice = new ItemNotice({
      ...this.notice,
      ...updateItemNoticeInput,
    });

    return this.notice;
  };

  public removeNotice = (): ItemNotice => {
    const { notice } = this;
    if (!notice) {
      throw new NotFoundException('삭제할 안내가 존재하지 않습니다.');
    }

    this.notice = null;
    return notice;
  };

  public createOptionSet = (inputs: CreateItemOptionInput[]): ItemOption[] => {
    if (this.options?.length > 0) {
      throw new ConflictException('옵션이 이미 존재합니다.');
    }

    return (this.options = inputs.map(
      (input) =>
        new ItemOption({
          name: input.name,
          values: input.values.map(
            (value) => new ItemOptionValue({ name: value })
          ),
        })
    ));
  };
}
