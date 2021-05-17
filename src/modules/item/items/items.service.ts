import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@src/common/dtos/pagination.dto';
import { ISpiderItem } from '@src/providers/spider/interfaces/spider.interface';

import {
  CreateItemInput,
  UpdateItemInput,
  BulkUpdateItemInput,
} from './dtos/item.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsRepository } from './items.repository';
import { ItemPrice } from './models/item-price.model';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';
import { AddItemPriceInput } from './dtos/item-price.input';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from './dtos/item-notice.input';
import { ItemNotice } from './models/item-notice.model';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {}

  async list(pageInput?: PageInput, relations: string[] = []): Promise<Item[]> {
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.itemsRepository.entityToModelMany(
      await this.itemsRepository.find({
        relations,
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async get(id: number, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.get(id, relations);
  }

  async create(
    createItemInput: CreateItemInput,
    relations: string[] = []
  ): Promise<Item> {
    const { priceInput, urlInput, ...itemAttributes } = createItemInput;

    const item = new Item({
      ...itemAttributes,
      prices: [new ItemPrice(priceInput)],
      urls: [new ItemUrl(urlInput)],
    });
    const newEntity = await this.itemsRepository.save(item);
    return await this.get(newEntity.id, relations);
  }

  async findOne(param: Partial<Item>, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.findOneEntity(param, relations);
  }

  async addUrl(item: Item, addItemUrlInput: AddItemUrlInput): Promise<ItemUrl> {
    const url = item.addUrl(addItemUrlInput);
    await this.itemsRepository.save(item);
    return url;
  }

  async addPrice(
    item: Item,
    addItemPriceInput: AddItemPriceInput
  ): Promise<ItemPrice> {
    const price = item.addPrice(addItemPriceInput);
    await this.itemsRepository.save(item);
    return price;
  }

  async removePrice(item: Item, priceId: number): Promise<Item> {
    const price = item.removePrice(priceId);
    await price.remove();
    return await this.itemsRepository.save(item);
  }

  async addNotice(
    item: Item,
    addItemNoticeInput: AddItemNoticeInput
  ): Promise<ItemNotice> {
    item.addNotice(addItemNoticeInput);
    await this.itemsRepository.save(item);
    return (await this.itemsRepository.get(item.id, ['notice'])).notice;
  }

  async updateNotice(
    item: Item,
    updateItemNoticeInput: UpdateItemNoticeInput
  ): Promise<ItemNotice> {
    item.updateNotice(updateItemNoticeInput);
    await this.itemsRepository.save(item);
    return (await this.itemsRepository.get(item.id, ['notice'])).notice;
  }

  async removeNotice(item: Item): Promise<Item> {
    const notice = item.removeNotice();
    await notice.remove();
    return await this.itemsRepository.save(item);
  }

  async updateById(
    item: Item,
    updateItemInput: UpdateItemInput
  ): Promise<Item> {
    return await this.itemsRepository.updateEntity(item, updateItemInput);
  }

  async bulkUpdate(
    ids: number[],
    bulkUpdateItemInput: BulkUpdateItemInput
  ): Promise<void> {
    await this.itemsRepository.bulkUpdate(ids, bulkUpdateItemInput);
  }

  async addByCrawlData(
    brandId: number,
    code: string,
    data: ISpiderItem
  ): Promise<Item> {
    return await this.create({
      brandId,
      name: data.name,
      providedCode: code,
      imageUrl: data.imageUrl,
      isMdRecommended: false,
      isSellable: false,
      urlInput: {
        isPrimary: true,
        url: data.url,
      },
      priceInput: {
        originalPrice: data.originalPrice,
        sellPrice: data.salePrice,
        pickkDiscountRate: 5,
        finalPrice: Math.floor((data.salePrice * 19) / 20),
        isActive: true,
        isBase: true,
        isCrawlUpdating: true,
      },
    });
  }

  async updateByCrawlData(item: Item, data: ISpiderItem): Promise<Item> {
    item.prices.forEach((price) => {
      if (!price.isCrawlUpdating) {
        return;
      }
      price.originalPrice = data.originalPrice;
      price.sellPrice = data.salePrice;
      price.finalPrice =
        (data.salePrice * (100 - price.pickkDiscountRate)) / 100;
    });
    item.name = data.name;

    return await this.itemsRepository.save(item);
  }
}
