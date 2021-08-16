import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { OrderRelationType, ORDER_RELATIONS } from './constants';
import {
  BaseOrderOutput,
  CancelOrderInput,
  RequestOrderRefundInput,
} from './dtos';
import { Order } from './models';

import { OrdersService } from './orders.service';
import { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class OrdersProcessResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;

  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService
  ) {
    super();
  }

  // @TODO: SQS에서 1. 재고복구, 2. Payment 채번취소 처리, 3. 완료 알림톡 전송
  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async dodgeVbankOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<BaseOrderOutput> {
    const order = await this.ordersService.get(merchantUid, ['orderItems']);
    if (order.userId !== userId) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }

    return await this.ordersService.dodgeVbank(order);
  }

  // @TODO: SQS에서 1. 재고복구, 2. 완료 알림톡 전송
  @Mutation(() => Order)
  @UseGuards(JwtVerifyGuard)
  async cancelOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('cancelOrderInput')
    input: CancelOrderInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Order> {
    const isMine = await this.ordersService.checkBelongsTo(merchantUid, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }

    await this.ordersService.cancel(merchantUid, input);

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
    const isMine = await this.ordersService.checkBelongsTo(merchantUid, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }

    await this.ordersService.requestRefund(merchantUid, input);

    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
