import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ItemCategoriesRepository } from './item-categories.repository';
import { ItemCategory } from './models/item-category.model';

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
