import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { JwtVerifyGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { OrderItemRelationType, ORDER_ITEM_RELATIONS } from './constants';
import { RequestOrderItemExchangeInput } from './dtos';
import { OrderItem } from './models';
import { OrderItemsProducer } from './producers';

import { OrderItemsService } from './order-items.service';

@Injectable()
export class OrderItemsProcessResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(
    @Inject(OrderItemsService)
    private readonly orderItemsService: OrderItemsService,
    private readonly orderItemsProducer: OrderItemsProducer
  ) {
    super();
  }

  @Mutation(() => OrderItem)
  @UseGuards(JwtVerifyGuard)
  async requestOrderItemExchange(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('requestOrderItemExchangeInput')
    input: RequestOrderItemExchangeInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<OrderItem> {
    await this.orderItemsService.checkBelongsTo(merchantUid, userId);

    const { exchangeRequest } = await this.orderItemsService.requestExchange(
      merchantUid,
      input
    );

    await this.orderItemsProducer.sendExchangeRequestedAlimtalk(
      exchangeRequest.merchantUid
    );

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
