import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver, DerivedFieldsInfoType } from '@common/base.resolver';

import { OrderClaimFaultOf } from '@order/refund-requests/constants';

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
    private readonly ordersService: OrdersService,
    private readonly ordersProducer: OrdersProducer
  ) {
    super();
  }

  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async dodgeVbankOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<BaseOrderOutput> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    const dodgedOrder = await this.ordersService.dodgeVbank(merchantUid);
    await this.ordersProducer.restoreDeductedProductStock(
      dodgedOrder.orderItems.map((oi) => oi.merchantUid)
    );

    return dodgedOrder;
  }

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

    await this.ordersService.cancel(merchantUid, input);
    await this.ordersProducer.restoreDeductedProductStock(
      input.orderItemMerchantUids
    );
    await this.ordersProducer.sendCancelOrderApprovedAlimtalk(
      merchantUid,
      input.orderItemMerchantUids
    );
    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => Int)
  @UseGuards(JwtVerifyGuard)
  async expectedCancelAmount(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('orderItemMerchantUids', { type: () => [String] })
    orderItemMerchantUids: string[]
  ): Promise<number> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    return await this.ordersService.getExpectedCancelAmount(
      merchantUid,
      orderItemMerchantUids
    );
  }

  @Query(() => Int)
  @UseGuards(JwtVerifyGuard)
  async expectedClaimShippingFee(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('orderItemMerchantUids', { type: () => [String] })
    orderItemMerchantUids: string[],
    @Args('faultOf', { type: () => OrderClaimFaultOf })
    faultOf: OrderClaimFaultOf
  ): Promise<number> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    return await this.ordersService.getExpectedClaimShippingFee(
      merchantUid,
      orderItemMerchantUids,
      faultOf
    );
  }

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

    const { refundRequests } = await this.ordersService.requestRefund(
      merchantUid,
      input
    );

    await this.ordersProducer.sendRefundRequestedAlimtalk(
      refundRequests[refundRequests.length - 1].merchantUid
    );

    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
