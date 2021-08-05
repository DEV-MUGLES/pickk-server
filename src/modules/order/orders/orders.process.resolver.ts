import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';
import { CancelPaymentInput } from '@payment/payments/dtos';
import { PaymentsService } from '@payment/payments/payments.service';

import { OrderRelationType, ORDER_RELATIONS } from './constants';
import { BaseOrderOutput, CancelOrderInput } from './dtos';
import { Order } from './models';

import { OrdersService } from './orders.service';

@Injectable()
export class OrdersProcessResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;

  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
    @Inject(PaymentsService)
    private readonly paymentsService: PaymentsService
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
    cancelOrderInput: CancelOrderInput
  ): Promise<Order> {
    const order = await this.ordersService.get(merchantUid, [
      'orderItems',
      'orderItems.product',
      'orderItems.product.item',
      'orderItems.product.item.brand',
      'orderItems.product.item.brand.seller',
      'orderItems.product.item.brand.seller.shippingPolicy',
      'vbankInfo',
    ]);
    if (order.userId !== userId) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }

    const { orderItemMerchantUids, amount, checksum } = cancelOrderInput;

    const cancelledOrder = await this.ordersService.cancel(
      order,
      orderItemMerchantUids,
      amount,
      checksum
    );

    const payment = await this.paymentsService.get(merchantUid);
    await this.paymentsService.cancel(
      payment,
      CancelPaymentInput.of(cancelledOrder, cancelOrderInput)
    );

    return order;
  }
}
