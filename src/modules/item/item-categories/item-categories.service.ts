import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ItemCategory } from './models';
import { ItemCategoriesRepository } from './item-categories.repository';

@Injectable()
export class ItemCategoriesService {
  constructor(
    @InjectRepository(ItemCategoriesRepository)
    private readonly itemCategoriesRepository: ItemCategoriesRepository
  ) {}

  async trees(): Promise<ItemCategory[]> {
    return await this.itemCategoriesRepository.findTrees();
  }
}
