import { Inject } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { GraphQLResolveInfo } from 'graphql';

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
  async itemCategories(
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemCategory[]> {
    return await this.itemCategoriesService.list(
      this.getRelationsFromInfo(info)
    );
  }
}
