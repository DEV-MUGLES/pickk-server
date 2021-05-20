import { Test, TestingModule } from '@nestjs/testing';
import { ISpiderItem } from '@src/providers/spider/interfaces/spider.interface';
import * as faker from 'faker';

import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsRepository } from './repositories/items.repository';
import { ItemsService } from './items.service';
import { ItemPrice } from './models/item-price.model';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';

describe('ItemsService', () => {
  let itemsService: ItemsService;
  let itemsRepository: ItemsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, ItemsRepository],
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

    it('should return created url', async () => {
      const item = new Item();
      const url = new ItemUrl(addItemUrlInput);

      const itemAddUrlSpy = jest.spyOn(item, 'addUrl').mockReturnValueOnce(url);
      const repositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(jest.fn());
      const result = await itemsService.addUrl(item, addItemUrlInput);

      expect(result).toEqual(url);
      expect(itemAddUrlSpy).toHaveBeenCalledWith(addItemUrlInput);
      expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should first url be primary', async () => {
      addItemUrlInput.isPrimary = false;

      const item = new Item();
      const url = new ItemUrl({
        ...addItemUrlInput,
        isPrimary: true,
      });

      const itemAddUrlSpy = jest.spyOn(item, 'addUrl').mockReturnValueOnce(url);
      const repositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(jest.fn());
      const result = await itemsService.addUrl(item, addItemUrlInput);

      expect(result).toEqual(url);
      expect(itemAddUrlSpy).toHaveBeenCalledWith(addItemUrlInput);
      expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateByCrawlData', () => {
    const spiderItem: ISpiderItem = {
      name: faker.lorem.text(),
      brandKor: faker.lorem.text(),
      imageUrl: faker.image.imageUrl(),
      originalPrice: faker.datatype.number(),
      salePrice: faker.datatype.number(),
      url: faker.internet.url(),
    };
    it('success', async () => {
      const item = new Item({
        prices: [
          new ItemPrice({
            isCrawlUpdating: true,
            pickkDiscountRate: 5,
          }),
        ],
      });
      const itemsRepositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(async (v) => v as any);

      const result = await itemsService.updateByCrawlData(item, spiderItem);
      expect(result.name).toEqual(spiderItem.name);
      expect(result.prices[0].originalPrice).toEqual(spiderItem.originalPrice);
      expect(result.prices[0].sellPrice).toEqual(spiderItem.salePrice);
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

      const itemsRepositorySaveSpy = jest
        .spyOn(itemsRepository, 'save')
        .mockImplementationOnce(async (v) => v as any);

      const result = await itemsService.updateByCrawlData(item, spiderItem);
      expect(result.name).toEqual(spiderItem.name);
      expect(result.prices[0].originalPrice).toBeFalsy();
      expect(result.prices[0].sellPrice).toBeFalsy();
      expect(itemsRepositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
