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
import { SlackService } from '@providers/slack';

import { ItemSearchService } from '@mcommon/search/item.search.service';
import { ProductsService } from '@item/products/products.service';
import { UserRole } from '@user/users/constants';

import { ItemRelationType, ITEM_RELATIONS } from './constants';
import { ItemFilter, SetCategoryToItemInput } from './dtos';
import { getSizeChartMetaDatas } from './helpers';
import { Item, ItemSizeChartMetaData } from './models';
import { ItemsService } from './items.service';

@Resolver(() => Item)
export class ItemsResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType = {
    prices: ['originalPrice', 'sellPrice', 'finalPrice'],
  };

  constructor(
    private readonly itemsService: ItemsService,
    private readonly productsService: ProductsService,
    private readonly itemSearchService: ItemSearchService,
    private readonly slackService: SlackService
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

  @Query(() => [Item])
  async searchItem(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item[]> {
    const ids = await this.itemSearchService.search(query, pageInput);

    return await this.itemsService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Boolean)
  async indexItem() {
    await this.itemSearchService.index(1);
    await this.itemSearchService.index(2);
    await this.itemSearchService.index(3);
    await this.itemSearchService.index(4);
    await this.itemSearchService.index(5);
    await this.itemSearchService.refresh();
  }

  @Mutation(() => Item)
  @UseGuards(JwtVerifyGuard)
  async createItemByUrl(
    @CurrentUser() { nickname }: JwtPayload,
    @Args('url') url: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Item> {
    try {
      const { id } = await this.itemsService.createByInfoCrawl(url);
      return await this.itemsService.get(id, this.getRelationsFromInfo(info));
    } catch (err) {
      await this.slackService.sendItemInfoCrawlFail(url, nickname);
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
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number,
    @Args('reason') reason: string
  ): Promise<boolean> {
    await this.itemsService.report(id, reason, payload.nickname);
    return true;
  }
}
