import { Injectable, UseGuards } from '@nestjs/common';
import { Info, Args, Query, Int } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { SearchOrderItemsOutput } from '@admin/seller/order/order-item/dtos';
import { OrderItemSearchFilter } from '@mcommon/search/dtos';
import { OrderItemSearchService } from '@mcommon/search/order-item.search.service';
import {
  OrderItemRelationType,
  ORDER_ITEM_RELATIONS,
} from '@order/order-items/constants';
import { OrderItemFilter } from '@order/order-items/dtos';
import { OrderItem } from '@order/order-items/models';
import { OrderItemsService } from '@order/order-items/order-items.service';
import { UserRole } from '@user/users/constants';

@Injectable()
export class RootOrderItemResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly orderItemSearchService: OrderItemSearchService
  ) {
    super();
  }

  @Query(() => [OrderItem])
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async rootOrderItems(
    @Info() info?: GraphQLResolveInfo,
    @Args('orderItemFilter', { nullable: true })
    filter?: OrderItemFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<OrderItem[]> {
    return await this.orderItemsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => SearchOrderItemsOutput)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async searchRootOrderItems(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: OrderItemSearchFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<SearchOrderItemsOutput> {
    const { ids: merchantUidIn, total } =
      await this.orderItemSearchService.search(query, pageInput, filter, [
        { merchantUid: 'desc' },
      ]);

    const orderItems = await this.orderItemsService.list(
      { merchantUidIn },
      null,
      ['order', 'order.buyer', 'order.receiver', 'shipment', 'shipment.courier']
    );

    return { total, result: orderItems };
  }

  @Query(() => Int)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async searchRootOrderItemsCount(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: OrderItemSearchFilter
  ): Promise<number> {
    const { total } = await this.orderItemSearchService.search(
      query,
      { offset: 0, limit: 0 } as PageInput,
      filter
    );

    return total;
  }
}
