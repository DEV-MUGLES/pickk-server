import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { ItemRelationType, ITEM_RELATIONS } from '@item/items/constants';
import {
  BulkUpdateItemInput,
  CreateItemDetailImageInput,
  AddItemUrlInput,
  AddItemPriceInput,
  UpdateItemPriceInput,
  CreateItemOptionSetInput,
  UpdateItemInput,
  UpdateItemOptionInput,
  ItemFilter,
  CreateItemSizeChartInput,
  UpdateItemSizeChartInput,
} from '@item/items/dtos';
import { Item, ItemOption, ItemUrl } from '@item/items/models';
import { ItemsService } from '@item/items/items.service';
import { ProductsService } from '@item/products/products.service';

@Resolver(() => Item)
export class SellerItemResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;

  constructor(
    private readonly itemsService: ItemsService,
    private readonly productsService: ProductsService
  ) {
    super();
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Query(() => [Item])
  async meSellerItems(
    @CurrentUser() { brandId }: JwtPayload,
    @Args('itemFilter', { nullable: true }) itemFilter?: ItemFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item[]> {
    return await this.itemsService.list(
      { brandId, ...itemFilter },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateSellerItem(
    @IntArgs('id') id: number,
    @Args('input') input: UpdateItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.update(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateSellerItemByCrawl(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateByCrawl(itemId);
    return await this.itemsService.get(itemId, ['prices']);
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => ItemOption)
  async updateSellerItemOption(
    @IntArgs('id') id: number,
    @Args('input')
    input: UpdateItemOptionInput
  ): Promise<ItemOption> {
    await this.itemsService.updateItemOption(id, input);
    return await this.itemsService.getItemOption(id, ['values']);
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateSellerItemImageUrl(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateImageUrl(itemId);
    return await this.itemsService.get(itemId);
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateSellerItemDetailImages(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateDetailImages(itemId);
    return await this.itemsService.get(itemId, ['detailImages']);
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Boolean)
  async bulkUpdateSellerItems(
    @Args('ids', { type: () => [Int] }) ids: number[],
    @Args('input') input: BulkUpdateItemInput
  ): Promise<boolean> {
    await this.itemsService.bulkUpdate(ids, input);
    return true;
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async addItemDetailImages(
    @IntArgs('itemId') itemId: number,
    @Args('createItemDetailImageInput')
    { urls }: CreateItemDetailImageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.addDetailImages(itemId, urls);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async removeItemDetailImage(
    @IntArgs('itemId') itemId: number,
    @Args('detailImageKey') detailImageKey: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.removeDetailImage(detailImageKey);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => ItemUrl)
  async addItemUrl(
    @IntArgs('itemId') itemId: number,
    @Args('addItemUrlInput')
    addItemUrlInput: AddItemUrlInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.addUrl(itemId, addItemUrlInput);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async addItemPrice(
    @IntArgs('itemId') itemId: number,
    @Args('addItemPriceInput')
    addItemPriceInput: AddItemPriceInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.addPrice(itemId, addItemPriceInput);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateSellerItemPrice(
    @IntArgs('id') id: number,
    @Args('input')
    input: UpdateItemPriceInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    const { itemId } = await this.itemsService.updateItemPrice(id, input);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async removeItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.removePrice(itemId, priceId);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async activateItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.activateItemPrice(item, priceId);
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async basifyPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.basifyPrice(item, priceId);
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async createSellerItemOptionSet(
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

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async createSellerSizeChart(
    @IntArgs('itemId') id: number,
    @Args('input') input: CreateItemSizeChartInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.createSizeChart(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateSellerSizeChart(
    @IntArgs('itemId') id: number,
    @Args('input') input: UpdateItemSizeChartInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.updateSizeChart(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async removeSellerSizeChart(
    @IntArgs('itemId') id: number,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.removeSizeChart(id);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }
}
