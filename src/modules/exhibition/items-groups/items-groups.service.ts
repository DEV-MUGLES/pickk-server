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
    const itemIds = await this.itemsGroupItemsRepository.findGroupItemIds(
      itemId
    );
    // group이 존재하지 않으면 입력된 itemId만 반환한다.
    if (!itemIds?.length) {
      return [itemId];
    }

    return itemIds;
  }
}
