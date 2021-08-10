import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import {
  OrderItemRelationType,
  ORDER_ITEM_RELATIONS,
} from '@order/order-items/constants';
import { OrderItemFilter } from '@order/order-items/dtos';
import { OrderItem } from '@order/order-items/models';
import { OrderItemsService } from '@order/order-items/order-items.service';

import { OrderItemsCountOutput } from './dtos';

import { SellerOrderItemService } from './seller-order-item.service';

@Injectable()
export class SellerOrderItemResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(
    @Inject(OrderItemsService)
    private readonly orderItemsService: OrderItemsService,
    @Inject(SellerOrderItemService)
    private readonly sellerOrderItemService: SellerOrderItemService,
    @Inject(CacheService) private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => [OrderItem])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerOrderItems(
    @CurrentUser() { sellerId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo,
    @Args('orderItemFilter', { nullable: true })
    filter?: OrderItemFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<OrderItem[]> {
    return await this.orderItemsService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => OrderItemsCountOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerOrderItemsCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<OrderItemsCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<OrderItemsCountOutput>(
        OrderItemsCountOutput.getCacheKey(sellerId)
      );
      cached.lastUpdatedAt = new Date(cached.lastUpdatedAt);

      if (cached) {
        return cached;
      }
    }

    const count = await this.sellerOrderItemService.getCount(sellerId);

    await this.cacheService.set<OrderItemsCountOutput>(count.cacheKey, count, {
      ttl: 60 * 5,
    });

    return count;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtSellerVerifyGuard)
  async bulkShipReadyMeSellerOrderItems(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUids', { type: () => [String], nullable: true })
    merchantUids?: string[]
  ): Promise<boolean> {
    await this.sellerOrderItemService.bulkShipReady(sellerId, merchantUids);

    return true;
  }
}
