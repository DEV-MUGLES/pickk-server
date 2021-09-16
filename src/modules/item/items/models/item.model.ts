import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { ItemInfoCrawlResult } from '@providers/crawler';

import { Campaign } from '@item/campaigns/models';
import { ItemCategory } from '@item/item-categories/models';
import { Product } from '@item/products/models';

import {
  AddItemUrlInput,
  CreateItemOptionInput,
  AddItemPriceInput,
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
} from '../dtos';
import { ItemEntity } from '../entities';
import { ItemDetailImageFactory } from '../factories';

import { ItemDetailImage } from './item-detail-image.model';
import { ItemOption } from './item-option.model';
import { ItemUrl } from './item-url.model';
import { ItemPrice } from './item-price.model';
import { ItemSizeChart } from './item-size-chart.model';
import { ItemOptionValue } from './item-option-value.model';
import { Brand } from '@item/brands/models';
import { ItemSalePolicy } from './item-sale-policy.model';

@ObjectType()
export class Item extends ItemEntity {
  @Field(() => Brand, { nullable: true })
  brand: Brand;

  @Field(() => ItemCategory, { nullable: true })
  majorCategory?: ItemCategory;
  @Field(() => ItemCategory, { nullable: true })
  minorCategory?: ItemCategory;

  @Type(() => ItemOption)
  @Field(() => [ItemOption], { nullable: true })
  options: ItemOption[];
  @Type(() => Product)
  @Field(() => [Product], { nullable: true })
  products: Product[];
  @Field(() => [Campaign], { nullable: true })
  campaigns: Campaign[];

  @Field(() => ItemSalePolicy, { nullable: true })
  salePolicy: ItemSalePolicy;
  @Field(() => [ItemPrice])
  prices: ItemPrice[];
  @Field(() => [ItemUrl])
  urls: ItemUrl[];
  @Field(() => [ItemDetailImage], { nullable: true })
  detailImages: ItemDetailImage[];

  @Field(() => [ItemSizeChart], { nullable: true })
  sizeCharts: ItemSizeChart[];

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

  private setBasePrice = (index: number): void => {
    this.prices.forEach((price, _index) => {
      price.isBase = _index === index;
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

  public addDetailImages = (urls: string[]): ItemDetailImage[] => {
    const detailImages = urls.map(ItemDetailImageFactory.from);
    this.detailImages = this.detailImages.concat(detailImages);
    return this.detailImages;
  };

  public addPrice = (addItemPriceInput: AddItemPriceInput): ItemPrice => {
    const itemPrice = new ItemPrice(addItemPriceInput);
    this.prices = (this.prices ?? []).concat(itemPrice);
    if (addItemPriceInput.isActive === true) {
      this.setActivePrice(this.prices.length - 1);
    }
    if (this.prices.length === 1) {
      this.setActivePrice(this.prices.length - 1);
      this.setBasePrice(this.prices.length - 1);
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

  public basifyPrice = (priceId: number): ItemPrice => {
    const index = this.prices.findIndex(({ id }) => id === priceId);
    if (index < 0) {
      throw new NotFoundException('해당 ItemPrice가 존재하지 않습니다.');
    }
    if (this.prices[index].isBase) {
      throw new ConflictException('해당 Price는 이미 Base 상태입니다.');
    }

    this.setBasePrice(index);
    return this.prices[index];
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

  public createOptionSet = (inputs: CreateItemOptionInput[]): ItemOption[] => {
    if (this.options?.length > 0) {
      throw new ConflictException('옵션이 이미 존재합니다.');
    }

    return (this.options = inputs.map(
      (input) =>
        new ItemOption({
          name: input.name,
          values: input.values.map((value) => new ItemOptionValue(value)),
        })
    ));
  };

  public addSizeCharts = (
    addItemSizeChartInputs: AddItemSizeChartInput[]
  ): ItemSizeChart[] => {
    this.sizeCharts = (this.sizeCharts ?? []).concat(
      addItemSizeChartInputs.map((input) => new ItemSizeChart(input))
    );
    return this.sizeCharts;
  };

  public updateSizeCharts = (
    updateSizeChartInputs: UpdateItemSizeChartInput[]
  ): ItemSizeChart[] => {
    updateSizeChartInputs.forEach((input) => {
      const index = this.sizeCharts.findIndex((v) => v.id === input.id);
      if (index < 0) {
        throw new NotFoundException('수정할 사이즈차트가 존재하지 않습니다.');
      }

      this.sizeCharts[index] = new ItemSizeChart({
        ...this.sizeCharts[index],
        ...input,
      });
    });
    return this.sizeCharts;
  };

  public removeSizeChartsAll = (): ItemSizeChart[] => {
    const { sizeCharts } = this;
    if ((this.sizeCharts ?? [])?.length === 0) {
      throw new NotFoundException('삭제할 사이즈 차트가 없습니다.');
    }

    this.sizeCharts = [];
    return sizeCharts;
  };

  public removeSizeChartsByIds = (removeIds: number[]): ItemSizeChart[] => {
    const { sizeCharts } = this;
    if ((this.sizeCharts ?? [])?.length === 0) {
      throw new NotFoundException('삭제할 사이즈 차트가 없습니다.');
    }

    this.sizeCharts = sizeCharts.filter((size) => !removeIds.includes(size.id));
    return this.sizeCharts;
  };

  public updateByCrawlResult = (crawlData: ItemInfoCrawlResult) => {
    const { originalPrice, salePrice, name, isSoldout } = crawlData;

    this?.prices.forEach((price) => {
      if (!price.isCrawlUpdating) {
        return;
      }
      price.originalPrice = originalPrice;
      price.sellPrice = salePrice;
      price.finalPrice = (salePrice * (100 - price.pickkDiscountRate)) / 100;
    });
    this.name = name;
    this.isSoldout = isSoldout;
  };
}
