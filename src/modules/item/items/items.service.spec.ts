import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';
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
});
