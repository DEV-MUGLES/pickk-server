import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { ItemRelationType, ITEM_RELATIONS } from '@item/items/constants';
import {
  AddItemPriceInput,
  AddItemUrlInput,
  BulkUpdateItemInput,
  CreateItemDetailImageInput,
  CreateItemOptionSetInput,
  CreateItemSizeChartInput,
  UpdateItemInput,
  UpdateItemOptionInput,
  UpdateItemPriceInput,
  UpdateItemSizeChartInput,
} from '@item/items/dtos';
import { Item, ItemOption, ItemUrl } from '@item/items/models';
import { ItemsService } from '@item/items/items.service';
import { ProductsService } from '@item/products/products.service';
import { UserRole } from '@user/users/constants';

@Resolver(() => Item)
export class RootItemResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;

  constructor(
    private readonly itemsService: ItemsService,
    private readonly productsService: ProductsService
  ) {
    super();
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async updateRootItemImageUrl(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateImageUrl(itemId);
    return await this.itemsService.get(itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootItemDetailImages(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateDetailImages(itemId);
    return await this.itemsService.get(itemId, ['detailImages']);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootItemByCrawl(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateByCrawl(itemId);
    return await this.itemsService.get(itemId, ['prices']);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async createRootSizeChart(
    @IntArgs('itemId') id: number,
    @Args('input') input: CreateItemSizeChartInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.createSizeChart(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootSizeChart(
    @IntArgs('itemId') id: number,
    @Args('input') input: UpdateItemSizeChartInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.updateSizeChart(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async removeRootSizeChart(
    @IntArgs('itemId') id: number,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.removeSizeChart(id);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Boolean)
  async bulkUpdateRootItems(
    @Args('ids', { type: () => [Int] }) ids: number[],
    @Args('input') input: BulkUpdateItemInput
  ): Promise<boolean> {
    await this.itemsService.bulkUpdate(ids, input);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootItem(
    @IntArgs('id') id: number,
    @Args('input') input: UpdateItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.update(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => ItemOption)
  async updateRootItemOption(
    @IntArgs('id') id: number,
    @Args('input')
    input: UpdateItemOptionInput
  ): Promise<ItemOption> {
    await this.itemsService.updateItemOption(id, input);
    return await this.itemsService.getItemOption(id, ['values']);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootItemPrice(
    @IntArgs('id') id: number,
    @Args('input')
    input: UpdateItemPriceInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    const { itemId } = await this.itemsService.updateItemPrice(id, input);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async createRootItemOptionSet(
    @IntArgs('id') id: number,
    @Args('input')
    { options }: CreateItemOptionSetInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.clearOptionSet(id);
    await this.itemsService.createOptionSet(id, options);
    await this.productsService.createByOptionSet(id);

    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async addRootItemDetailImages(
    @IntArgs('id') id: number,
    @Args('input')
    { urls }: CreateItemDetailImageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.addDetailImages(id, urls);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async removeRootItemDetailImage(
    @IntArgs('id') id: number,
    @Args('detailImageKey') detailImageKey: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.removeDetailImage(detailImageKey);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => ItemUrl)
  async addRootItemUrl(
    @IntArgs('id') id: number,
    @Args('input')
    input: AddItemUrlInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.addUrl(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async addRootItemPrice(
    @IntArgs('id') id: number,
    @Args('input')
    input: AddItemPriceInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.addPrice(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async removeRootItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.removePrice(itemId, priceId);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async activateRootItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.activateItemPrice(item, priceId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async basifyRootPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.basifyPrice(item, priceId);
  }
}
