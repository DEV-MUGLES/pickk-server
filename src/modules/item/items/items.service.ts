import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CrawlerProviderService } from '@providers/crawler';

import { ItemRelationType } from './constants';
import {
  CreateItemInput,
  UpdateItemInput,
  BulkUpdateItemInput,
  AddItemUrlInput,
  ItemFilter,
  AddItemNoticeInput,
  UpdateItemNoticeInput,
  CreateItemOptionInput,
  UpdateItemOptionInput,
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
  AddItemPriceInput,
  UpdateItemPriceInput,
  UpdateByCrawlDatasDto,
} from './dtos';
import { ItemFactory } from './factories';
import {
  ItemPrice,
  Item,
  ItemNotice,
  ItemOption,
  ItemDetailImage,
} from './models';

import {
  ItemDetailImagesRepository,
  ItemOptionsRepository,
  ItemOptionValuesRepository,
  ItemPricesRepository,
  ItemsRepository,
  ItemSizeChartsRepository,
} from './items.repository';

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
    private readonly itemDetailImagesRepository: ItemDetailImagesRepository,
    private readonly crawlerService: CrawlerProviderService
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
        where: {
          ...parseFilter(_itemFilter, _pageInput?.idFilter),
          [itemFilter?.orderBy ?? 'id']: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async get(id: number, relations: ItemRelationType[] = []): Promise<Item> {
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

  async create(input: CreateItemInput): Promise<Item> {
    const item = ItemFactory.from(input);
    return await this.itemsRepository.save(item);
  }

  async createMany(createItemInputs: CreateItemInput[]) {
    const items = createItemInputs.map((input) => ItemFactory.from(input));
    return await this.itemsRepository.save(items);
  }

  async findOne(param: Partial<Item>, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.findOneEntity(param, relations);
  }

  async addDetailImages(itemId: number, urls: string[]): Promise<Item> {
    const item = await this.get(itemId, ['detailImages']);
    item.addDetailImages(urls);
    return await this.itemsRepository.save(item);
  }

  async removeDetailImage(key: string): Promise<void> {
    const detailImage = await this.getItemDetailImage(key);
    await this.itemDetailImagesRepository.remove(detailImage);
  }

  async addUrl(
    itemId: number,
    addItemUrlInput: AddItemUrlInput
  ): Promise<Item> {
    const item = await this.get(itemId, ['urls']);
    item.addUrl(addItemUrlInput);

    return await this.itemsRepository.save(item);
  }

  async addPrice(
    itemId: number,
    addItemPriceInput: AddItemPriceInput
  ): Promise<Item> {
    const item = await this.get(itemId, ['prices']);
    item.addPrice(addItemPriceInput);

    return await this.itemsRepository.save(item);
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

  async removeNotice(itemId: number): Promise<void> {
    const item = await this.get(itemId, ['notice']);
    if (!item.notice) {
      throw new NotFoundException('삭제할 안내가 존재하지 않습니다.');
    }

    await item.notice.remove();
  }

  async update(id: number, input: UpdateItemInput): Promise<Item> {
    const item = await this.get(id);
    return await this.itemsRepository.save(new Item({ ...item, ...input }));
  }

  async updateItemOption(
    id: number,
    input: UpdateItemOptionInput
  ): Promise<ItemOption> {
    const itemOption = await this.getItemOption(id);

    return await this.itemOptionsRepository.save(
      new ItemOption({
        ...itemOption,
        ...input,
      })
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

  async updateByCrawlDatas({ updateItemDatas }: UpdateByCrawlDatasDto) {
    const updatedItems = updateItemDatas.map((data) => {
      const { item, itemData: infoCrawlResult } = data;
      item.updateByCrawlResult(infoCrawlResult);
      return item;
    });
    return await this.itemsRepository.save(updatedItems);
  }

  /** 해당 아이템의 option, optionValue를 모두 삭제합니다. */
  async clearOptionSet(id: number) {
    const item = await this.get(id, ['options', 'options.values']);
    const optionValues = item.options.reduce(
      (acc, curr) => acc.concat(curr.values),
      []
    );
    await this.itemOptionValuesRepository.remove(optionValues);
    await this.itemOptionsRepository.remove(item.options);
  }

  async createOptionSet(
    id: number,
    options: CreateItemOptionInput[]
  ): Promise<Item> {
    const item = await this.get(id, ['options', 'options.values']);
    item.createOptionSet(options);
    return await this.itemsRepository.save(item);
  }

  async crawlOptionSet(id: number): Promise<Item> {
    const item = await this.get(id, ['urls', 'options', 'options.values']);
    const { options } = await this.crawlerService.crawlOption(item.urls[0].url);
    await this.clearOptionSet(id);
    return await this.createOptionSet(id, options);
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
