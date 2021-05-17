import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Info, Mutation, Args, Int } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';

import { ITEM_RELATIONS } from './constants/item.relation';
import { AddItemPriceInput } from './dtos/item-price.input';
import { UpdateItemInput, BulkUpdateItemInput } from './dtos/item.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsService } from './items.service';
import { ItemPrice } from './models/item-price.model';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';
import { PageInput } from '@src/common/dtos/pagination.dto';
import { ItemNotice } from './models/item-notice.model';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from './dtos/item-notice.input';
import { Roles } from '@src/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@src/authentication/guards';
import { UserRole } from '@src/modules/user/users/constants/user.enum';
import { ItemFilter } from './dtos/item.filter';

@Resolver(() => Item)
export class ItemsResolver extends BaseResolver {
  relations = ITEM_RELATIONS;

  protected getRelationsFromInfo(info: GraphQLResolveInfo): string[] {
    const relations = super.getRelationsFromInfo(info);
    const simplifiedInfo = this.getSimplifiedInfo(info);

    if (
      ['originalPrice', 'finalPrice'].some(
        (field) => field in simplifiedInfo.fields
      )
    ) {
      relations.push('prices');
    }

    return relations;
  }

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
  async items(
    @Args('itemFilter', { nullable: true }) itemFilter?: ItemFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item[]> {
    return await this.itemsService.list(
      itemFilter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Item)
  async updateItem(
    @IntArgs('itemId') itemId: number,
    @Args('updateItemInput') updateItemInput: UpdateItemInput
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId);
    return await this.itemsService.updateById(item, updateItemInput);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async bulkUpdateItems(
    @Args('ids', { type: () => [Int] }) ids: number[],
    @Args('bulkUpdateItemInput') bulkUpdateItemInput: BulkUpdateItemInput
  ): Promise<boolean> {
    await this.itemsService.bulkUpdate(ids, bulkUpdateItemInput);
    return true;
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemUrl)
  async addItemUrl(
    @IntArgs('itemId') itemId: number,
    @Args('addItemUrlInput')
    addItemUrlInput: AddItemUrlInput
  ): Promise<ItemUrl> {
    const item = await this.itemsService.get(itemId, ['urls']);
    return await this.itemsService.addUrl(item, addItemUrlInput);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemPrice)
  async addItemPrice(
    @IntArgs('itemId') itemId: number,
    @Args('addItemPriceInput')
    addItemPriceInput: AddItemPriceInput
  ): Promise<ItemPrice> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.addPrice(item, addItemPriceInput);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async removeItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.removePrice(item, priceId);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemNotice)
  async addItemNotice(
    @IntArgs('itemId') itemId: number,
    @Args('addItemNoticeInput')
    addItemNoticeInput: AddItemNoticeInput
  ): Promise<ItemNotice> {
    const item = await this.itemsService.get(itemId, ['notice']);
    return await this.itemsService.addNotice(item, addItemNoticeInput);
  }

  @Mutation(() => ItemNotice)
  async updateItemNotice(
    @IntArgs('itemId') itemId: number,
    @Args('updateItemNoticeInput')
    updateItemNoticeInput: UpdateItemNoticeInput
  ): Promise<ItemNotice> {
    const item = await this.itemsService.get(itemId, ['notice']);
    return await this.itemsService.updateNotice(item, updateItemNoticeInput);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async removeItemNotice(@IntArgs('itemId') itemId: number): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['notice']);
    return await this.itemsService.removeNotice(item);
  }
}
