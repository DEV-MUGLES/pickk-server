import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { AddItemProfileUrlInput } from './dtos/item-profile-url.input';
import { ItemProfilesRepository } from './item-profiles.repository';
import { ItemProfilesService } from './item-profiles.service';
import { ItemProfileUrl } from './models/item-profile-url.model';
import { ItemProfile } from './models/item-profile.model';

describe('ItemProfilesService', () => {
  let itemProfilesService: ItemProfilesService;
  let itemProfilesRepository: ItemProfilesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemProfilesService, ItemProfilesRepository],
    }).compile();

    itemProfilesService = module.get<ItemProfilesService>(ItemProfilesService);
    itemProfilesRepository = module.get<ItemProfilesRepository>(
      ItemProfilesRepository
    );
  });

  it('shoud be defined', () => {
    expect(itemProfilesService).toBeDefined();
  });

  describe('addUrl', () => {
    const addItemProfileUrlInput: AddItemProfileUrlInput = {
      url: faker.internet.url(),
      isPrimary: true,
    };

    it('should return created url', async () => {
      const itemProfile = new ItemProfile();
      const url = new ItemProfileUrl(addItemProfileUrlInput);

      const itemProfileAddUrlSpy = jest
        .spyOn(itemProfile, 'addUrl')
        .mockReturnValueOnce(url);
      const repositorySaveSpy = jest
        .spyOn(itemProfilesRepository, 'save')
        .mockImplementationOnce(jest.fn());
      const result = await itemProfilesService.addUrl(
        itemProfile,
        addItemProfileUrlInput
      );

      expect(result).toEqual(url);
      expect(itemProfileAddUrlSpy).toHaveBeenCalledWith(addItemProfileUrlInput);
      expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should first url be primary', async () => {
      addItemProfileUrlInput.isPrimary = false;

      const itemProfile = new ItemProfile();
      const url = new ItemProfileUrl({
        ...addItemProfileUrlInput,
        isPrimary: true,
      });

      const itemProfileAddUrlSpy = jest
        .spyOn(itemProfile, 'addUrl')
        .mockReturnValueOnce(url);
      const repositorySaveSpy = jest
        .spyOn(itemProfilesRepository, 'save')
        .mockImplementationOnce(jest.fn());
      const result = await itemProfilesService.addUrl(
        itemProfile,
        addItemProfileUrlInput
      );

      expect(result).toEqual(url);
      expect(itemProfileAddUrlSpy).toHaveBeenCalledWith(addItemProfileUrlInput);
      expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
