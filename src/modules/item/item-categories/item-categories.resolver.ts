import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { BaseResolver } from '@common/base.resolver';

import { ITEM_CATEGORY_RELATIONS } from './constants/item-category.relation';
import { ItemCategoriesService } from './item-categories.service';
import { ItemCategory } from './models/item-category.model';

@Resolver(() => ItemCategory)
export class ItemCategoriesResolver extends BaseResolver {
  relations = ITEM_CATEGORY_RELATIONS;

  constructor(
    @Inject(ItemCategoriesService)
    private itemCategoriesService: ItemCategoriesService
  ) {
    super();
  }

  @Query(() => [ItemCategory])
  async itemCategoryTree(): Promise<ItemCategory[]> {
    return await this.itemCategoriesService.trees();
  }

  @Query(() => [ItemCategory])
  async itemMajorCategories(): Promise<ItemCategory[]> {
    const trees = await this.itemCategoriesService.trees();
    return trees[0].children;
  }

  @Query(() => [ItemCategory])
  async itemMinorCategories(): Promise<ItemCategory[]> {
    const trees = await this.itemCategoriesService.trees();
    return (trees[0].children as ItemCategory[]).reduce(
      (acc, curr) => acc.concat(curr.children),
      []
    );
  }
}
