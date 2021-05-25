import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Info, Mutation, Args, Int } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@src/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@src/authentication/guards';
import { BaseResolver, DerivedFieldsInfoType } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { PageInput } from '@src/common/dtos/pagination.dto';
import { UserRole } from '@user/users/constants/user.enum';

import { ITEM_RELATIONS } from './constants/item.relation';
import {
  AddItemPriceInput,
  UpdateItemPriceInput,
} from './dtos/item-price.input';
import { UpdateItemInput, BulkUpdateItemInput } from './dtos/item.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsService } from './items.service';
import { ItemPrice } from './models/item-price.model';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';
import { ItemNotice } from './models/item-notice.model';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from './dtos/item-notice.input';
import { ItemFilter } from './dtos/item.filter';

import {
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
} from './dtos/item-size-chart.input';

import { ProductsService } from '../products/products.service';
import {
  CreateItemOptionSetInput,
  UpdateItemOptionInput,
} from './dtos/item-option.input';
import { ItemOption } from './models/item-option.model';
import { CreateItemDetailImageInput } from './dtos/item-detail-image.dto';

@Resolver(() => Item)
export class ItemsResolver extends BaseResolver<Item> {
  relations = ITEM_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType<Item> = {
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
    return await this.itemsService.removePrice(item, priceId);
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

  @Mutation(() => Item)
  async addItemSizeCharts(
    @IntArgs('itemId') itemId: number,
    @Args({
      name: 'addItemSizeChartInput',
      type: () => [AddItemSizeChartInput],
    })
    addItemSizeChartInput: AddItemSizeChartInput[]
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['sizeCharts']);
    return await this.itemsService.addSizeCharts(item, addItemSizeChartInput);
  }

  @Mutation(() => Item)
  async removeItemSizeChartsAll(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['sizeCharts']);
    return await this.itemsService.removeSizeChartsAll(item);
  }

  @Mutation(() => Item)
  async modifyItemSizeCharts(
    @IntArgs('itemId') itemId: number,
    @Args('updateItemSizeChartInput', {
      type: () => [UpdateItemSizeChartInput],
      nullable: true,
    })
    updateItemSizeChartInputs: UpdateItemSizeChartInput[],
    @Args('removeItemSizeChartInput', {
      type: () => [Int],
      nullable: true,
    })
    removeItemSizeChartInputs: number[]
  ): Promise<Item> {
    const item = await this.itemsService.get(itemId, ['sizeCharts']);
    const updateSizeChartInputs = updateItemSizeChartInputs.filter(
      (input) => input.id
    );
    const addSizeChartInputs: AddItemSizeChartInput[] = [];
    updateItemSizeChartInputs.forEach((input) => {
      if (!input.id) addSizeChartInputs.push(input as AddItemSizeChartInput);
    });

    if (removeItemSizeChartInputs) {
      await this.itemsService.removeSizeChartsByIds(
        item,
        removeItemSizeChartInputs
      );
    }
    if (addSizeChartInputs) {
      await this.itemsService.addSizeCharts(item, addSizeChartInputs);
    }

    return await this.itemsService.updateSizeCharts(
      item,
      updateSizeChartInputs
    );
  }
}
