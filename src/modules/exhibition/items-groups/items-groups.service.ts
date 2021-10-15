import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ItemsGroupItemsRepository } from './items-groups.repository';

@Injectable()
export class ItemsGroupsService {
  constructor(
    @InjectRepository(ItemsGroupItemsRepository)
    private readonly itemsGroupItemsRepository: ItemsGroupItemsRepository
  ) {}

  async findGroupItemIds(itemId: number): Promise<number[]> {
    return await this.itemsGroupItemsRepository.findGroupItemIds(itemId);
  }
}
