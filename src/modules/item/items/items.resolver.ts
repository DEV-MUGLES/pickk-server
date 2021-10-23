import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Info,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtAuthGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver, DerivedFieldsInfoType } from '@common/base.resolver';

import { ItemSearchService } from '@mcommon/search/item.search.service';
import { ProductsService } from '@item/products/products.service';
import { UserRole } from '@user/users/constants';

import { ItemRelationType, ITEM_RELATIONS } from './constants';
import {
  ItemFilter,
  ManualCreateItemInput,
  SetCategoryToItemInput,
} from './dtos';
import { Item } from './models';
import { ItemsProducer } from './producers';

import { ItemsService } from './items.service';

@Resolver(() => Item)
export class ItemsResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType = {
    prices: ['originalPrice', 'sellPrice', 'finalPrice', 'pickkDiscountRate'],
    itemsGroupItem: ['groupItems'],
    'itemsGroupItem.group': ['groupItems'],
    'itemsGroupItem.group.groupItems': ['groupItems'],
    'itemsGroupItem.group.groupItems.item': ['groupItems'],
  };

  constructor(
    private readonly itemsService: ItemsService,
    private readonly productsService: ProductsService,
    private readonly itemsProducer: ItemsProducer,
    private readonly itemSearchService: ItemSearchService
  ) {
    super();
  }

  @Query(() => Item)
  async item(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
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

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async crawlItemOptionSet(
    @IntArgs('itemId') id: number,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.itemsService.crawlOptionSet(id);
    await this.productsService.createByOptionSet(id);

    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => Item)
  @UseGuards(JwtVerifyGuard)
  async createItemByUrl(
    @CurrentUser() { nickname }: JwtPayload,
    @Args('url') url: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    try {
      const existing = await this.itemsService.findByUrl(
        url,
        this.getRelationsFromInfo(info)
      );
      if (existing) {
        return existing;
      }

      const { id } = await this.itemsService.createByInfoCrawl(url);
      await this.itemsProducer.sendItemCreationSuccessSlackMessage(
        id,
        nickname
      );
      return await this.itemsService.get(id, this.getRelationsFromInfo(info));
    } catch (err) {
      await this.itemsProducer.sendItemCreationFailSlackMessage(url, nickname);
      throw err;
    }
  }

  @Mutation(() => Item)
  @UseGuards(JwtVerifyGuard)
  async setCategoryToItem(
    @IntArgs('id') id: number,
    @Args('setCategoryToItemInput')
    input: SetCategoryToItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    await this.itemsService.update(id, input);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => Boolean, {
    description: '정보에 오류가 있는 아이템을 신고합니다.',
  })
  @UseGuards(JwtVerifyGuard)
  async reportItem(
    @CurrentUser() { nickname }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('reason') reason: string
  ): Promise<boolean> {
    await this.itemsService.report(id, reason, nickname);
    return true;
  }

  @Mutation(() => Item)
  @UseGuards(JwtVerifyGuard)
  async manualCreateItem(
    @CurrentUser() { nickname }: JwtPayload,
    @Args('input') input: ManualCreateItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    const { id } = await this.itemsService.manualCreate(input);
    await this.itemsProducer.sendItemCreationSuccessSlackMessage(id, nickname);
    return await this.itemsService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Item])
  async searchAllItem(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item[]> {
    const { ids } = await this.itemSearchService.search(query, pageInput);

    return await this.itemsService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => [Item])
  async searchPurchasableItem(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item[]> {
    const { ids } = await this.itemSearchService.search(query, pageInput, {
      isPurchasable: true,
    });

    return await this.itemsService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }
}
