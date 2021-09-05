import { GraphQLResolveInfo } from 'graphql';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver, DerivedFieldsInfoType } from '@common/base.resolver';

import { OrderRelationType, ORDER_RELATIONS } from './constants';
import {
  BaseOrderOutput,
  CancelOrderInput,
  RequestOrderRefundInput,
} from './dtos';
import { Order } from './models';
import { OrdersProducer } from './producers';

import { OrdersService } from './orders.service';

@Injectable()
export class OrdersProcessResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType = {
    orderItems: ['brands'],
    'orderItems.seller': ['brands'],
    'orderItems.seller.brand': ['brands'],
    'orderItems.seller.shippingPolicy': ['brands'],
  };

  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
    private readonly ordersProducer: OrdersProducer
  ) {
    super();
  }

  // @TODO: SQS에서 1. Payment 채번취소 처리, 3. 완료 알림톡 전송
  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async dodgeVbankOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<BaseOrderOutput> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    const dodgedOrder = await this.ordersService.dodgeVbank(merchantUid);
    await this.ordersProducer.restoreDeductedProductStock(dodgedOrder);

    return dodgedOrder;
  }

  // @TODO: SQS에서 완료 알림톡 전송
  @Mutation(() => Order)
  @UseGuards(JwtVerifyGuard)
  async cancelOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('cancelOrderInput')
    input: CancelOrderInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Order> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    const canceledOrder = await this.ordersService.cancel(merchantUid, input);
    await this.ordersProducer.restoreDeductedProductStock(canceledOrder);

    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  // @TODO: 완료 알림톡 전송.
  @Mutation(() => Order)
  @UseGuards(JwtVerifyGuard)
  async requestOrderRefund(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('requestOrderRefundInput')
    input: RequestOrderRefundInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Order> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    await this.ordersService.requestRefund(merchantUid, input);

    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
