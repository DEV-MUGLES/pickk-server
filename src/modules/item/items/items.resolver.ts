import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Info,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver, DerivedFieldsInfoType } from '@common/base.resolver';
import { ProductsService } from '@item/products/products.service';
import { UserRole } from '@user/users/constants';

import { ItemRelationType, ITEM_RELATIONS } from './constants';
import {
  AddItemPriceInput,
  UpdateItemPriceInput,
  UpdateItemInput,
  BulkUpdateItemInput,
  AddItemUrlInput,
  AddItemNoticeInput,
  UpdateItemNoticeInput,
  ItemFilter,
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
  CreateItemOptionSetInput,
  UpdateItemOptionInput,
  CreateItemDetailImageInput,
} from './dtos';
import { getSizeChartMetaDatas } from './helpers';
import {
  ItemPrice,
  ItemUrl,
  Item,
  ItemNotice,
  ItemOption,
  ItemSizeChartMetaData,
} from './models';
import { ItemsService } from './items.service';

@Resolver(() => Item)
export class ItemsResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType = {
    prices: ['originalPrice', 'sellPrice', 'finalPrice'],
  };

  constructor(
    @Inject(ItemsService)
    private readonly itemsService: ItemsService,
    @Inject(ProductsService)
    private readonly productsService: ProductsService
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

  @ResolveField(() => [ItemSizeChartMetaData], { nullable: true })
  async sizeChartMetaDatas(@Parent() item: Item) {
    if (item.majorCategory === undefined || item.minorCategory === undefined) {
      return null;
    }
    const {
      majorCategory: { code: majorCode },
      minorCategory: { code: minorCode },
    } = item;

    return getSizeChartMetaDatas(majorCode, minorCode);
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
    return await this.itemsService.update(item, updateItemInput);
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
    createItemDetailImageInput: CreateItemDetailImageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    const item = await this.itemsService.get(
      itemId,
      this.getRelationsFromInfo(info, ['detailImages'])
    );
    return await this.itemsService.addDetailImages(
      item,
      createItemDetailImageInput
    );
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async removeItemDetailImage(
    @IntArgs('itemId') itemId: number,
    @Args('detailImageKey') detailImageKey: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    const detailImage = await this.itemsService.getItemDetailImage(
      detailImageKey
    );
    await this.itemsService.removeDetailImage(detailImage);
    return await this.itemsService.get(
      itemId,
      this.getRelationsFromInfo(info, ['detailImages'])
    );
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
  @Mutation(() => ItemPrice)
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

  @Mutation(() => ItemOption)
  async updateItemOption(
    @IntArgs('id') id: number,
    @Args('updateItemOptionInput')
    updateItemOptionInput: UpdateItemOptionInput
  ): Promise<ItemOption> {
    const itemOption = await this.itemsService.getItemOption(id);
    return await this.itemsService.updateItemOption(
      itemOption,
      updateItemOptionInput,
      ['values']
    );
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async removeItemNotice(@IntArgs('itemId') itemId: number): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['notice']);
    return await this.itemsService.removeNotice(item);
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
    const item = await this.itemsService.get(
      id,
      this.getRelationsFromInfo(info, ['products', 'options', 'options.values'])
    );
    const newItem = await this.productsService
      .bulkRemove(item.products)
      .then(async () => await this.itemsService.clearOptionSet(item))
      .then(
        async (_item) => await this.itemsService.createOptionSet(_item, options)
      );
    await this.productsService.createByOptionSet(newItem);

    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
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
