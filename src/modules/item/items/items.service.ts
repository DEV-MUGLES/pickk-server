import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { ISpiderItem } from '@providers/spider/interfaces/spider.interface';

import {
  CreateItemInput,
  UpdateItemInput,
  BulkUpdateItemInput,
} from './dtos/item.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemFilter } from './dtos/item.filter';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from './dtos/item-notice.input';
import {
  CreateItemOptionInput,
  UpdateItemOptionInput,
} from './dtos/item-option.input';
import {
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
} from './dtos/item-size-chart.input';

import {
  AddItemPriceInput,
  UpdateItemPriceInput,
} from './dtos/item-price.input';
import {
  ItemDetailImagesRepository,
  ItemOptionsRepository,
  ItemOptionValuesRepository,
  ItemPricesRepository,
  ItemsRepository,
  ItemSizeChartsRepository,
} from './items.repository';

import { ItemPrice } from './models/item-price.model';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';
import { ItemNotice } from './models/item-notice.model';
import { ItemOption } from './models/item-option.model';
import { ItemDetailImage } from './models/item-detail-image.model';
import { CreateItemDetailImageInput } from './dtos/item-detail-image.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository,
    @InjectRepository(ItemOptionsRepository)
    private readonly itemOptionsRepository: ItemOptionsRepository,
    @InjectRepository(ItemOptionValuesRepository)
    private readonly itemOptionValuesRepository: ItemOptionValuesRepository,
    @InjectRepository(ItemSizeChartsRepository)
    private readonly itemSizeChartsRepository: ItemSizeChartsRepository,
    @InjectRepository(ItemPricesRepository)
    private readonly itemPricesRepository: ItemPricesRepository,
    @InjectRepository(ItemDetailImagesRepository)
    private readonly itemDetailImagesRepository: ItemDetailImagesRepository
  ) {}

  async list(
    itemFilter?: ItemFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<Item[]> {
    const _itemFilter = plainToClass(ItemFilter, itemFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.itemsRepository.entityToModelMany(
      await this.itemsRepository.find({
        relations,
        where: parseFilter(_itemFilter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async get(id: number, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.get(id, relations);
  }

  async getItemDetailImage(
    key: string,
    relations: string[] = []
  ): Promise<ItemDetailImage> {
    return await this.itemDetailImagesRepository.get(key, relations);
  }

  async getItemOption(
    id: number,
    relations: string[] = []
  ): Promise<ItemOption> {
    return await this.itemOptionsRepository.get(id, relations);
  }

  async getItemPrice(id: number, relations: string[] = []): Promise<ItemPrice> {
    return await this.itemPricesRepository.get(id, relations);
  }

  async create(
    createItemInput: CreateItemInput,
    relations: string[] = []
  ): Promise<Item> {
    const { priceInput, urlInput, ...itemAttributes } = createItemInput;

    const item = new Item({
      ...itemAttributes,
      prices: [new ItemPrice({ ...priceInput, isActive: true, isBase: true })],
      urls: [new ItemUrl({ ...urlInput, isPrimary: true })],
    });
    const newEntity = await this.itemsRepository.save(item);
    return await this.get(newEntity.id, relations);
  }

  async findOne(param: Partial<Item>, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.findOneEntity(param, relations);
  }

  async addDetailImages(
    item: Item,
    createItemDetailImageInput: CreateItemDetailImageInput
  ): Promise<Item> {
    item.addDetailImages(createItemDetailImageInput);
    return await this.itemsRepository.save(item);
  }

  async removeDetailImage(itemDetailImage: ItemDetailImage): Promise<void> {
    await this.itemDetailImagesRepository.remove(itemDetailImage);
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

  async updateItemPrice(
    itemPrice: ItemPrice,
    updateItemPriceInput: UpdateItemPriceInput,
    relations: string[] = []
  ): Promise<ItemPrice> {
    return await this.itemPricesRepository.updateEntity(
      itemPrice,
      updateItemPriceInput,
      relations
    );
  }

  async removePrice(item: Item, priceId: number): Promise<Item> {
    const price = item.removePrice(priceId);
    await price.remove();
    return await this.itemsRepository.save(item);
  }

  async basifyPrice(item: Item, priceId: number): Promise<Item> {
    item.basifyPrice(priceId);
    return await this.itemsRepository.save(item);
  }

  async activateItemPrice(item: Item, priceId: number): Promise<Item> {
    item.activatePrice(priceId);
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
    const result = await this.itemsRepository.save(item);
    await notice.remove();
    return result;
  }

  async update(item: Item, updateItemInput: UpdateItemInput): Promise<Item> {
    return await this.itemsRepository.updateEntity(item, updateItemInput);
  }

  async updateItemOption(
    itemOption: ItemOption,
    updateItemOptionInput: UpdateItemOptionInput,
    relations: string[] = []
  ): Promise<ItemOption> {
    return await this.itemOptionsRepository.updateEntity(
      itemOption,
      updateItemOptionInput,
      relations
    );
  }

  async bulkUpdate(
    ids: number[],
    bulkUpdateItemInput: BulkUpdateItemInput
  ): Promise<void> {
    if (bulkUpdateItemInput.isSellable) {
      bulkUpdateItemInput.sellableAt = new Date();
    }
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

  /** 해당 아이템의 option, optionValue를 모두 삭제합니다. */
  async clearOptionSet(item: Item): Promise<Item> {
    const optionValues = item.options.reduce(
      (acc, curr) => acc.concat(curr.values),
      []
    );
    await this.itemOptionValuesRepository.remove(optionValues);
    await this.itemOptionsRepository.remove(item.options);
    return this.get(item.id, ['options', 'options.values', 'products']);
  }

  async createOptionSet(
    item: Item,
    options: CreateItemOptionInput[]
  ): Promise<Item> {
    item.createOptionSet(options);
    await this.itemsRepository.save(item);
    return this.get(item.id, ['options', 'options.values', 'products']);
  }

  async addSizeCharts(
    item: Item,
    addItemSizeChartInputs: AddItemSizeChartInput[]
  ): Promise<Item> {
    if (!addItemSizeChartInputs) {
      return item;
    }
    item.addSizeCharts(addItemSizeChartInputs);
    return await this.itemsRepository.save(item);
  }

  async removeSizeChartsAll(item: Item): Promise<Item> {
    await this.itemSizeChartsRepository.bulkDelete(
      item.sizeCharts.map(({ id }) => id)
    );
    item.removeSizeChartsAll();
    return await this.itemsRepository.save(item);
  }

  async removeSizeChartsByIds(
    item: Item,
    removeItemSizeChartInputs: number[]
  ): Promise<Item> {
    if (!removeItemSizeChartInputs) {
      return item;
    }

    item.removeSizeChartsByIds(removeItemSizeChartInputs);
    await this.itemSizeChartsRepository.bulkDelete(removeItemSizeChartInputs);

    return await this.itemsRepository.save(item);
  }

  async updateSizeCharts(
    item: Item,
    updateItemSizeChartInputs: UpdateItemSizeChartInput[]
  ): Promise<Item> {
    if (!updateItemSizeChartInputs) {
      return item;
    }

    item.updateSizeCharts(updateItemSizeChartInputs);
    return await this.itemsRepository.save(item);
  }
}
