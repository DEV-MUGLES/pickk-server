import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '@providers/cache/redis';

import { ItemCategory } from './models';
import { ItemCategoriesRepository } from './item-categories.repository';

@Injectable()
export class ItemCategoriesService {
  constructor(
    @InjectRepository(ItemCategoriesRepository)
    private readonly itemCategoriesRepository: ItemCategoriesRepository,
    private readonly cacheService: CacheService
  ) {}

  private get treeCacheKey(): string {
    return 'item-category-tree';
  }

  async tree(): Promise<ItemCategory[]> {
    const cached = await this.cacheService.get<ItemCategory[]>(
      this.treeCacheKey
    );

    return cached ?? (await this.reloadTree());
  }

  async reloadTree(): Promise<ItemCategory[]> {
    const tree = await this.itemCategoriesRepository.findTrees();

    await this.cacheService.set(this.treeCacheKey, tree);
    return tree;
  }
}
