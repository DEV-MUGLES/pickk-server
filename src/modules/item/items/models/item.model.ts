import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';

import { AddItemUrlInput } from '../dtos/item-url.input';
import { CreateItemOptionInput } from '../dtos/item-option.input';
import { AddItemPriceInput } from '../dtos/item-price.input';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from '../dtos/item-notice.input';
import {
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
} from '../dtos/item-size-chart.input';

import { ItemEntity } from '../entities/item.entity';
import { ItemDetailImage } from './item-detail-image.model';
import { ItemOption } from './item-option.model';
import { ItemUrl } from './item-url.model';
import { Product } from '../../products/models/product.model';
import { ItemPrice } from './item-price.model';
import { ItemNotice } from './item-notice.model';
import { ItemSizeChart } from './item-size-chart.model';

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

  @Field(() => [ItemSizeChart], { nullable: true })
  sizeCharts: ItemSizeChart[];

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

  public addSizeCharts = (
    addItemSizeChartInputs: AddItemSizeChartInput[]
  ): ItemSizeChart[] => {
    if (!this.sizeCharts) this.sizeCharts = [];
    addItemSizeChartInputs?.forEach((input) => {
      const sizeChart = new ItemSizeChart(input);
      this.sizeCharts.push(sizeChart);
    });
    return this.sizeCharts;
  };

  public updateSizeCharts = (
    updateSizeChartInputs: UpdateItemSizeChartInput[]
  ): ItemSizeChart[] => {
    updateSizeChartInputs.forEach((input) => {
      const index = this.sizeCharts.findIndex((v) => v.id === input.id);
      if (index === -1) {
        throw new NotFoundException('수정할 사이즈차트가 존재하지 않습니다.');
      }
      const newSizeChart = plainToClass(
        ItemSizeChart,
        this.sizeCharts[index]
      ) as ItemSizeChart;
      newSizeChart.update(input);
      this.sizeCharts[index] = newSizeChart;
    });
    return this.sizeCharts;
  };

  public removeSizeChartsAll = (): ItemSizeChart[] => {
    const { sizeCharts } = this;
    if (!this.sizeCharts) {
      throw new NotFoundException('삭제할 사이즈 차트가 없습니다.');
    }
    this.sizeCharts = null;
    return sizeCharts;
  };

  public removeSizeChartsByIds = (removeIds: number[]): ItemSizeChart[] => {
    const { sizeCharts } = this;
    if (!this.sizeCharts) {
      throw new NotFoundException('삭제할 사이즈 차트가 없습니다.');
    }
    sizeCharts.forEach((size, index) => {
      if (removeIds.includes(size.id)) {
        sizeCharts[index] = null;
      }
    });

    this.sizeCharts = sizeCharts.filter((size) => size !== null);
    return this.sizeCharts;
  };
}
