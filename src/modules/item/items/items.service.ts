import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import validator from 'validator';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CrawlerProviderService } from '@providers/crawler';
import { SlackService } from '@providers/slack';

import { ImagesService } from '@mcommon/images/images.service';
import { BrandsService } from '@item/brands/brands.service';

import { CRAWLED_ITEM_IMAGE_S3_PREFIX, ItemRelationType } from './constants';
import {
  CreateItemInput,
  BulkUpdateItemInput,
  AddItemUrlInput,
  ItemFilter,
  CreateItemOptionInput,
  UpdateItemOptionInput,
  AddItemPriceInput,
  UpdateItemPriceInput,
  UpdateByCrawlDatasDto,
  ManualCreateItemInput,
  CreateItemSizeChartInput,
  UpdateItemSizeChartInput,
} from './dtos';
import { InvalidItemUrlException } from './exceptions';
import { ItemFactory } from './factories';
import { getItemDetailImageS3Prefix } from './helpers';
import { ItemPrice, Item, ItemOption, ItemDetailImage } from './models';

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
    private readonly brandsService: BrandsService,
    private readonly crawlerService: CrawlerProviderService,
    private readonly slackService: SlackService,
    private readonly imagesService: ImagesService
  ) {}

  async list(
    filter?: ItemFilter,
    pageInput?: PageInput,
    relations: ItemRelationType[] = []
  ): Promise<Item[]> {
    const _filter = plainToClass(ItemFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.itemsRepository.entityToModelMany(
      await this.itemsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        order: {
          [_filter?.orderBy ?? 'id']: 'DESC',
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

  async findByUrl(
    url: string,
    relations: ItemRelationType[] = []
  ): Promise<Item> {
    const id = await this.itemsRepository.findIdByUrl(url);
    if (!id) {
      return null;
    }
    return await this.get(id, relations);
  }

  async create(input: CreateItemInput): Promise<Item> {
    const item = ItemFactory.from(input);
    return await this.itemsRepository.save(item);
  }

  async createByInfoCrawl(url: string): Promise<Item> {
    const crawlResult = await this.crawlerService.crawlInfo(url);

    const brand = await this.brandsService.getOrCreate({
      nameKor: crawlResult.brandKor,
    });
    const { seller } = await this.brandsService.get(brand.id, [
      'seller',
      'seller.saleStrategy',
    ]);

    const [uploaded] = await this.imagesService.uploadUrls(
      [crawlResult.imageUrl],
      CRAWLED_ITEM_IMAGE_S3_PREFIX
    );

    return await this.create({
      ...CreateItemInput.create(
        crawlResult,
        seller?.saleStrategy.pickkDiscountRate ?? 0
      ),
      brandId: brand.id,
      imageUrl: uploaded.url,
    });
  }

  async manualCreate(input: ManualCreateItemInput): Promise<Item> {
    const brand = await this.brandsService.getOrCreate({
      nameKor: input.brandNameKor,
    });
    const { seller } = await this.brandsService.get(brand.id, [
      'seller',
      'seller.saleStrategy',
    ]);

    return await this.create({
      ...CreateItemInput.create(
        { ...input, salePrice: input.sellPrice },
        seller?.saleStrategy.pickkDiscountRate ?? 0
      ),
      ...input,
      brandId: brand.id,
    });
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
    id: number,
    input: UpdateItemPriceInput
  ): Promise<ItemPrice> {
    const itemPrice = await this.getItemPrice(id);
    return await this.itemPricesRepository.save(
      new ItemPrice({
        ...itemPrice,
        ...input,
      })
    );
  }

  async removePrice(itemId: number, priceId: number): Promise<Item> {
    const item = await this.get(itemId, ['prices']);
    const price = item.removePrice(priceId);
    await this.itemPricesRepository.remove(price);
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

  async update(id: number, input: Partial<Item>): Promise<Item> {
    const item = await this.get(id);
    return await this.itemsRepository.save(new Item({ ...item, ...input }));
  }

  async updateByCrawl(id: number) {
    const item = await this.get(id, ['urls', 'prices']);
    if (!validator.isURL(item.url)) {
      throw new InvalidItemUrlException();
    }

    const { name, salePrice, originalPrice } =
      await this.crawlerService.crawlInfo(item.url);
    await this.update(item.id, { name });

    if (item.sellPrice === salePrice && item.originalPrice === originalPrice) {
      return;
    }
    await this.updateItemPrice(
      item.prices.find(({ isActive }) => isActive === true).id,
      {
        sellPrice: salePrice,
        finalPrice: (salePrice * (100 - item.pickkDiscountRate)) / 100,
        originalPrice,
      }
    );
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

  async updateImageUrl(id: number) {
    const item = await this.get(id, ['urls']);
    if (!validator.isURL(item.url)) {
      throw new InvalidItemUrlException();
    }

    const crawlResult = await this.crawlerService.crawlInfo(item.url);
    const [uploaded] = await this.imagesService.uploadUrls(
      [crawlResult.imageUrl],
      CRAWLED_ITEM_IMAGE_S3_PREFIX
    );

    await this.itemsRepository.update(id, { imageUrl: uploaded.url });
    await this.imagesService.removeByUrls([item.imageUrl]);
  }

  async updateDetailImages(id: number) {
    const item = await this.get(id, ['urls', 'detailImages']);
    if (!validator.isURL(item.url)) {
      throw new InvalidItemUrlException();
    }

    const crawlResult = await this.crawlerService.crawlInfo(item.url);
    if (crawlResult.images.length === 0) {
      return;
    }

    const uploadedImages = await this.imagesService.uploadUrls(
      crawlResult.images.map((v) => encodeURI(v)),
      getItemDetailImageS3Prefix(item.id)
    );
    await this.addDetailImages(
      id,
      uploadedImages.map((v) => v.url)
    );
    await this.imagesService.removeByKeys(item.detailImages.map((v) => v.key));
    await this.itemDetailImagesRepository.remove(item.detailImages);
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
    const { options } = await this.crawlerService.crawlOption(item.url);
    await this.clearOptionSet(id);
    return await this.createOptionSet(id, options);
  }

  async report(id: number, reason: string, nickname: string): Promise<void> {
    const item = await this.get(id, ['brand', 'urls']);
    await this.slackService.sendItemReport(item, reason, nickname);
  }

  async createSizeChart(
    id: number,
    input: CreateItemSizeChartInput
  ): Promise<Item> {
    const item = await this.get(id, ['sizeChart']);
    if (!input) {
      return item;
    }
    item.createSizeChart(input);
    return await this.itemsRepository.save(item);
  }

  async updateSizeChart(
    id: number,
    input: UpdateItemSizeChartInput
  ): Promise<Item> {
    const item = await this.get(id, ['sizeChart']);
    item.updateSizeChart(input);
    return await this.itemsRepository.save(item);
  }

  async removeSizeChart(id: number) {
    const item = await this.get(id, ['sizeChart']);
    if (!item.sizeChart) {
      throw new BadRequestException(
        '해당 아이템에 사이즈표가 존재하지 않습니다.'
      );
    }

    const { sizeChart } = item;
    item.sizeChart = null;
    await this.itemsRepository.save(item);
    await this.itemSizeChartsRepository.remove(sizeChart);
  }
}
