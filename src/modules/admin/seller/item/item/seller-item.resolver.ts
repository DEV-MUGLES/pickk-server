import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtAuthGuard, JwtSellerVerifyGuard } from '@auth/guards';
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
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
  CreateItemOptionSetInput,
  UpdateItemInput,
  UpdateItemOptionInput,
  ItemFilter,
} from '@item/items/dtos';
import { Item, ItemOption, ItemPrice, ItemUrl } from '@item/items/models';
import { ItemsService } from '@item/items/items.service';
import { ProductsService } from '@item/products/products.service';
import { UserRole } from '@user/users/constants';

@Resolver(() => Item)
export class SellerItemResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;

  constructor(
    private readonly itemsService: ItemsService,
    private readonly productsService: ProductsService
  ) {
    super();
  }

  @Roles(UserRole.Seller)
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

  @Roles(UserRole.Seller)
  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Item)
  async updateItem(
    @IntArgs('itemId') itemId: number,
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.update(itemId, updateItemInput);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemOption)
  async updateItemOption(
    @IntArgs('id') id: number,
    @Args('updateItemOptionInput')
    updateItemOptionInput: UpdateItemOptionInput
  ): Promise<ItemOption> {
    await this.itemsService.updateItemOption(id, updateItemOptionInput);
    return await this.itemsService.getItemOption(id, ['values']);
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

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async removeItemDetailImage(
    @IntArgs('itemId') itemId: number,
    @Args('detailImageKey') detailImageKey: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.removeDetailImage(detailImageKey);
    return await this.itemsService.get(itemId, this.getRelationsFromInfo(info));
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
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

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
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

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async updateItemPrice(
    @IntArgs('id') id: number,
    @Args('updateItemPriceInput')
    updateItemPriceInput: UpdateItemPriceInput
  ): Promise<ItemPrice> {
    const itemPrice = await this.itemsService.getItemPrice(id);
    return await this.itemsService.updateItemPrice(
      itemPrice,
      updateItemPriceInput
    );
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
  @Mutation(() => Item)
  async activateItemPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.activateItemPrice(item, priceId);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async basifyPrice(
    @IntArgs('itemId') itemId: number,
    @IntArgs('priceId') priceId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['prices']);
    return await this.itemsService.basifyPrice(item, priceId);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async addItemSizeCharts(
    @IntArgs('itemId') itemId: number,
    @Args({
      name: 'addItemSizeChartInputs',
      type: () => [AddItemSizeChartInput],
    })
    addItemSizeChartInputs: AddItemSizeChartInput[]
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['sizeCharts']);
    return await this.itemsService.addSizeCharts(item, addItemSizeChartInputs);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async removeItemSizeChartsAll(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['sizeCharts']);
    return await this.itemsService.removeSizeChartsAll(item);
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async createItemOptionSet(
    @IntArgs('id') id: number,
    @Args('createItemOptionSetInput')
    { options }: CreateItemOptionSetInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.clearOptionSet(id);
    await this.itemsService.createOptionSet(id, options);
    await this.productsService.createByOptionSet(id);

    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async modifyItemSizeCharts(
    @IntArgs('itemId') itemId: number,
    @Args('updateItemSizeChartInput', {
      type: () => [UpdateItemSizeChartInput],
      nullable: true,
    })
    updateItemSizeChartInputs: UpdateItemSizeChartInput[],
    @Args('removedChartIds', {
      type: () => [Int],
      nullable: true,
    })
    removedChartIds: number[]
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['sizeCharts']);

    const addInputs: AddItemSizeChartInput[] = updateItemSizeChartInputs.filter(
      (input) => input.id === null
    );
    const updateInputs = updateItemSizeChartInputs.filter(
      (input) => input.id !== null
    );

    if (removedChartIds?.length > 0) {
      await this.itemsService.removeSizeChartsByIds(item, removedChartIds);
    }
    if (addInputs?.length > 0) {
      await this.itemsService.addSizeCharts(item, addInputs);
    }

    return await this.itemsService.updateSizeCharts(item, updateInputs);
  }
}
