import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models';
import { OrderItem } from '@order/order-items/models';

import { OrderStatus } from '../constants';
import { StartOrderInput } from '../dtos';
import { OrderEntity } from '../entities';

import { OrderBuyer } from './order-buyer.model';
import { OrderReceiver } from './order-receiver.model';
import { OrderRefundAccount } from './order-refund-account.model';

@ObjectType()
export class Order extends OrderEntity {
  @Field({
    description:
      'ApolloClient 최적화를 위한 필드입니다. DB에는 존재하지 않습니다.',
  })
  get id(): string {
    return this.merchantUid;
  }

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  start(input: StartOrderInput, coupons: Coupon[]) {
    this.payMethod = input.payMethod;
    this.totalUsedPointAmount = input.usedPointAmount;
    this.spreadUsedPoint(input.usedPointAmount);
    this.buyer = new OrderBuyer({ ...input.buyerInput });
    this.receiver = new OrderReceiver({ ...input.receiverInput });
    this.markPaying();

    if (input.refundAccountInput) {
      this.refundAccount = new OrderRefundAccount({
        ...input.refundAccountInput,
      });
    }

    for (const orderItem of this.orderItems) {
      const { product } = orderItem;

      if (product.isShipReserving) {
        orderItem.isShipReserved = true;
        orderItem.shipReservedAt =
          product.shippingReservePolicy.estimatedShippingBegginDate;
      }

      const orderItemInput = (input.orderItemInputs || []).find(
        (itemInput) => itemInput.merchantUid === orderItem.merchantUid
      );
      if (!orderItemInput) {
        continue;
      }

      const coupon = coupons.find(
        (coupon) => coupon.id === orderItemInput.usedCouponId
      );
      if (!coupon) {
        throw new NotFoundException(
          `쿠폰[${orderItemInput.usedCouponId}]는 존재하지 않습니다.`
        );
      }

      orderItem.useCoupon(coupon);
    }

    this.totalCouponDiscountAmount = this.orderItems.reduce(
      (sum, orderItem) => sum + orderItem.couponDiscountAmount,
      0
    );
    this.totalPayAmount =
      this.totalItemFinalPrice -
      this.totalUsedPointAmount -
      this.totalCouponDiscountAmount;
  }

  /** evenly spread usedPointAmount to each orderItem */
  private spreadUsedPoint(usedPointAmount: number) {
    const { orderItems, totalItemFinalPrice } = this;

    for (const orderItem of this.orderItems) {
      const { itemFinalPrice } = orderItem;
      orderItem.usedPointAmount = Math.ceil(
        (itemFinalPrice / totalItemFinalPrice) * usedPointAmount
      );
    }

    orderItems[0].usedPointAmount +=
      usedPointAmount -
      orderItems.reduce((sum, orderItem) => sum + orderItem.usedPointAmount, 0);
  }

  private markPaying() {
    const { VbankReady, Paid, Withdrawn } = OrderStatus;

    if ([VbankReady, Paid, Withdrawn].includes(this.status)) {
      throw new BadRequestException('해당 주문은 결제할 수 없습니다.');
    }

    this.status = OrderStatus.Paying;
    this.payingAt = new Date();
  }
}
