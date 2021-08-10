import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import { GraphQLResolveInfo } from 'graphql';
import dayjs from 'dayjs';

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
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemsService } from '@order/order-items/order-items.service';

import { OrderItemsCountOutput } from './dtos';

@Injectable()
export class SellerOrderItemResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(
    @Inject(OrderItemsService)
    private readonly orderItemsService: OrderItemsService,
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository,
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

    const orderItems = await this.orderItemsRepository.find({
      select: ['status', 'claimStatus'],
      where: {
        sellerId,
        createdAt: MoreThanOrEqual(dayjs().subtract(1, 'month').toDate()),
      },
    });

    const result = OrderItemsCountOutput.create(sellerId, orderItems);
    await this.cacheService.set<OrderItemsCountOutput>(
      result.cacheKey,
      result,
      { ttl: 60 * 5 }
    );

    return result;
  }
}
