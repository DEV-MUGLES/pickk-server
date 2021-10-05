import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { JwtVerifyGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { OrderItemRelationType, ORDER_ITEM_RELATIONS } from './constants';
import { OrderItem } from './models';

import { OrderItemsService } from './order-items.service';

@Injectable()
export class OrderItemsProcessResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(private readonly orderItemsService: OrderItemsService) {
    super();
  }

  @Query(() => OrderItem)
  @UseGuards(JwtVerifyGuard)
  async meOrderItem(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<OrderItem> {
    await this.orderItemsService.checkBelongsTo(merchantUid, userId);

    return await this.orderItemsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => OrderItem)
  @UseGuards(JwtVerifyGuard)
  async confirmMeOrderItem(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<OrderItem> {
    await this.orderItemsService.checkBelongsTo(merchantUid, userId);
    await this.orderItemsService.confirm(merchantUid);

    return await this.orderItemsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
