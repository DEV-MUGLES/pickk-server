import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemProfilesRepository } from './item-profiles.repository';
import { ItemProfile } from './models/item-profile.model';

@Injectable()
export class ItemProfilesService {
  constructor(
    @InjectRepository(ItemProfilesRepository)
    private readonly itemProfilesRepository: ItemProfilesRepository
  ) {}

  async list(relations: string[] = []): Promise<ItemProfile[]> {
    return await this.itemProfilesRepository.find({ relations });
  }

  async get(id: number, relations: string[] = []): Promise<ItemProfile> {
    return await this.itemProfilesRepository.get(id, relations);
  }
}
