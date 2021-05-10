import { Inject } from '@nestjs/common';
import { Resolver, Query, Info, Mutation, Args } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';

import { ITEM_RELATIONS } from './constants/item.relation';
import { AddItemPriceInput } from './dtos/item-price.input';
import { UpdateItemInput } from './dtos/item-update.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsService } from './items.service';
import { ItemPrice } from './models/item-price.model';
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

  @Mutation(() => Item)
  async updateItem(
    @IntArgs('itemId') itemId: number,
    @Args('updateItemInput') updateItemInput: UpdateItemInput
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId);
    return await this.itemsService.updateById(item, updateItemInput);
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

  @Mutation(() => ItemPrice)
  async addItemPrice(
    @IntArgs('itemId') itemId: number,
    @Args('addItemPriceInput')
    addItemPriceInput: AddItemPriceInput
  ): Promise<ItemPrice> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.addPrice(item, addItemPriceInput);
  }

  @Mutation(() => Item)
  async removeItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.removePrice(item, priceId);
  }
}
