import { Inject } from '@nestjs/common';
import { Resolver, Query, Info, Mutation, Args } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';

import { ITEM_RELATIONS } from './constants/item.relation';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsService } from './items.service';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';

@Resolver(() => Item)
export class ItemsResolver extends BaseResolver {
  relations = ITEM_RELATIONS;

  constructor(
    @Inject(ItemsService)
    private itemsService: ItemsService
  ) {
    super();
  }

  @Query(() => Item)
  async item(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    return this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Item])
  async items(@Info() info?: GraphQLResolveInfo): Promise<Item[]> {
    return this.itemsService.list(this.getRelationsFromInfo(info));
  }

  @Mutation(() => ItemUrl)
  async addItemUrl(
    @IntArgs('itemId') itemId: number,
    @Args('addItemUrlInput')
    addItemUrlInput: AddItemUrlInput
  ): Promise<ItemUrl> {
    const item = await this.itemsService.get(itemId, ['urls']);
    return await this.itemsService.addUrl(item, addItemUrlInput);
  }
}
