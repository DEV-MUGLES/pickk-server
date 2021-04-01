import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AddItemProfileUrlInput } from './dtos/item-profile-url.input';
import { ItemProfilesRepository } from './item-profiles.repository';
import { ItemProfileUrl } from './models/item-profile-url.model';
import { ItemProfile } from './models/item-profile.model';

@Injectable()
export class ItemProfilesService {
  constructor(
    @InjectRepository(ItemProfilesRepository)
    private readonly itemProfilesRepository: ItemProfilesRepository
  ) {}

  async list(relations: string[] = []): Promise<ItemProfile[]> {
    return this.itemProfilesRepository.entityToModelMany(
      await this.itemProfilesRepository.find({ relations })
    );
  }

  async get(id: number, relations: string[] = []): Promise<ItemProfile> {
    return await this.itemProfilesRepository.get(id, relations);
  }

  async addUrl(
    itemProfile: ItemProfile,
    addItemProfileUrlInput: AddItemProfileUrlInput
  ): Promise<ItemProfileUrl> {
    const url = itemProfile.addUrl(addItemProfileUrlInput);
    await this.itemProfilesRepository.save(itemProfile);
    return url;
  }
}
