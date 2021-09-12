import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { CrawlerProviderModule, ItemInfoCrawlResult } from '@providers/crawler';

import { ImagesService } from '@mcommon/images/images.service';
import { BrandsService } from '@item/brands/brands.service';

import { AddItemUrlInput, UpdateByCrawlDatasDto } from './dtos';
import { ItemPrice, ItemUrl, Item } from './models';

import {
  ItemDetailImagesRepository,
  ItemOptionsRepository,
  ItemOptionValuesRepository,
  ItemSizeChartsRepository,
  ItemPricesRepository,
  ItemsRepository,
} from './items.repository';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let itemsService: ItemsService;
  let itemsRepository: ItemsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrawlerProviderModule],
      providers: [
        ItemsService,
        ItemsRepository,
        ItemOptionsRepository,
        ItemOptionValuesRepository,
        ItemSizeChartsRepository,
        ItemPricesRepository,
        ItemDetailImagesRepository,
        {
          provide: BrandsService,
          useValue: new BrandsService(null),
        },
        {
          provide: ImagesService,
          useValue: new ImagesService(null, null),
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemsRepository = module.get<ItemsRepository>(ItemsRepository);
  });

  it('shoud be defined', () => {
    expect(itemsService).toBeDefined();
  });

  describe('addUrl', () => {
    const addItemUrlInput: AddItemUrlInput = {
      url: faker.internet.url(),
      isPrimary: true,
    };

    it('성공', async () => {
      const item = new Item({ id: faker.datatype.number() });
      const url = new ItemUrl(addItemUrlInput);

      const itemsServiceGetSpy = jest
        .spyOn(itemsService, 'get')
        .mockResolvedValueOnce(item);
      const itemAddUrlSpy = jest.spyOn(item, 'addUrl').mockReturnValueOnce(url);
      const repositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(jest.fn());
      await itemsService.addUrl(item.id, addItemUrlInput);

      expect(itemsServiceGetSpy).toHaveBeenCalledWith(item.id, ['urls']);
      expect(itemAddUrlSpy).toHaveBeenCalledWith(addItemUrlInput);
      expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateByCrawlDatas', () => {
    it('successfully update one item', async () => {
      const item = new Item({
        prices: [
          new ItemPrice({
            isCrawlUpdating: true,
            pickkDiscountRate: 5,
          }),
        ],
      });
      const itemData: ItemInfoCrawlResult = {
        name: faker.lorem.text(),
        brandKor: faker.lorem.text(),
        imageUrl: faker.image.imageUrl(),
        originalPrice: faker.datatype.number(),
        salePrice: faker.datatype.number(),
        url: faker.internet.url(),
        images: [faker.image.abstract()],
        isSoldout: faker.datatype.boolean(),
      };
      const updateByCrawlDatasDto: UpdateByCrawlDatasDto = {
        updateItemDatas: [
          {
            item,
            itemData,
          },
        ],
      };

      const itemsRepositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(async (v) => v as any);

      const result = await itemsService.updateByCrawlDatas(
        updateByCrawlDatasDto
      );
      expect(result[0].name).toEqual(itemData.name);
      expect(result[0].prices[0].originalPrice).toEqual(itemData.originalPrice);
      expect(result[0].prices[0].sellPrice).toEqual(itemData.salePrice);
      expect(itemsRepositorySaveSpy).toHaveBeenCalledTimes(1);
    });

    it('isCrawlUpdaing=false인 price는 업데이트하지 않는다.', async () => {
      const item = new Item({
        prices: [
          new ItemPrice({
            isCrawlUpdating: false,
            pickkDiscountRate: 5,
          }),
        ],
      });
      const itemData: ItemInfoCrawlResult = {
        name: faker.lorem.text(),
        brandKor: faker.lorem.text(),
        imageUrl: faker.image.imageUrl(),
        originalPrice: faker.datatype.number(),
        salePrice: faker.datatype.number(),
        url: faker.internet.url(),
        images: [faker.image.abstract()],
        isSoldout: faker.datatype.boolean(),
      };
      const updateByCrawlDatasDto: UpdateByCrawlDatasDto = {
        updateItemDatas: [
          {
            item,
            itemData,
          },
        ],
      };

      const itemsRepositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(async (v) => v as any);

      const result = await itemsService.updateByCrawlDatas(
        updateByCrawlDatasDto
      );
      expect(result[0].name).toEqual(itemData.name);
      expect(result[0].prices[0].originalPrice).toBeFalsy();
      expect(result[0].prices[0].sellPrice).toBeFalsy();
      expect(itemsRepositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
