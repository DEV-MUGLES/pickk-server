import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models';
import {
  OrderItemClaimStatus,
  OrderItemStatus,
} from '@order/order-items/constants';
import { OrderItem } from '@order/order-items/models';
import { RefundRequest } from '@order/refund-requests/models/refund-request.model';
import { PayMethod } from '@payment/payments/constants';
import { plainToClass } from 'class-transformer';

import { OrderStatus } from '../constants';
import { CreateOrderVbankReceiptInput, StartOrderInput } from '../dtos';
import { OrderEntity } from '../entities';
import { calcTotalShippingFee } from '../helpers';

import { OrderBuyer } from './order-buyer.model';
import { OrderReceiver } from './order-receiver.model';
import { OrderRefundAccount } from './order-refund-account.model';
import { OrderVbankReceipt } from './order-vbank-receipt.model';

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

  @Field(() => RefundRequest)
  refundRequest: RefundRequest;

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

  fail() {
    this.markFailed();
  }

  complete(createOrderVbankReceiptInput?: CreateOrderVbankReceiptInput) {
    if (this.payMethod === PayMethod.Vbank) {
      if (!createOrderVbankReceiptInput) {
        throw new BadRequestException(
          '가상결제 주문건을 완료처리하기 위한 정보가 제공되지 않았습니다.'
        );
      }

      this.markVbankReady();
      this.vbankInfo = new OrderVbankReceipt(createOrderVbankReceiptInput);
    } else {
      this.markPaid();
    }
  }

  dodgeVbank() {
    this.markVbankDodged();
  }

  cancel(orderItemMerchantUids: string[]) {
    if (orderItemMerchantUids.length === 0) {
      throw new BadRequestException('1개 이상의 주문 상품을 입력해주세요.');
    }

    for (const merchantUid of orderItemMerchantUids) {
      const orderItem = this.getOrderItem(merchantUid);
      orderItem.cancel();

      this.totalItemFinalPrice -= orderItem.itemFinalPrice;
      this.totalUsedPointAmount -= orderItem.usedPointAmount;
      this.totalCouponDiscountAmount -= orderItem.couponDiscountAmount;
    }

    this.totalShippingFee = this.calcTotalShippingFee();
    this.totalPayAmount =
      this.totalItemFinalPrice +
      this.totalShippingFee -
      this.totalUsedPointAmount -
      this.totalCouponDiscountAmount;
  }

  private getOrderItem(merchantUid: string): OrderItem {
    const orderItem = this.orderItems.find(
      (orderItem) => orderItem.merchantUid === merchantUid
    );
    if (!orderItem) {
      throw new NotFoundException(
        `주문 상품[${merchantUid}]이 존재하지 않습니다.`
      );
    }

    return plainToClass(OrderItem, orderItem);
  }

  private calcTotalShippingFee() {
    const { CancelRequested, Cancelled } = OrderItemClaimStatus;
    const calcInput = this.orderItems
      .filter(
        (oi) => [CancelRequested, Cancelled].includes(oi.claimStatus) === false
      )
      .map((oi) => ({ product: oi.product, quantity: oi.quantity }));

    return calcTotalShippingFee(calcInput);
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
    const { VbankReady, Paid, VbankDodged } = OrderStatus;

    if ([VbankReady, Paid, VbankDodged].includes(this.status)) {
      throw new BadRequestException('해당 주문은 결제할 수 없습니다.');
    }

    this.status = OrderStatus.Paying;
    this.payingAt = new Date();
  }

  private markFailed() {
    const { VbankReady, Paid, VbankDodged } = OrderStatus;

    if ([VbankReady, Paid, VbankDodged].includes(this.status)) {
      throw new BadRequestException('완료된 주문을 실패처리할 수 없습니다');
    }

    this.status = OrderStatus.Failed;
    this.failedAt = new Date();

    for (const orderItem of this.orderItems) {
      orderItem.status = OrderItemStatus.Failed;
      orderItem.failedAt = new Date();
    }
  }

  private markVbankReady() {
    const { VbankReady, Paid, VbankDodged } = OrderStatus;

    if ([VbankReady, Paid, VbankDodged].includes(this.status)) {
      throw new BadRequestException(
        '완료된 주문을 가상결제대기 처리할 수 없습니다'
      );
    }

    this.status = OrderStatus.VbankReady;
    this.vbankReadyAt = new Date();

    for (const orderItem of this.orderItems) {
      orderItem.status = OrderItemStatus.VbankReady;
      orderItem.vbankReadyAt = new Date();
    }
  }

  private markPaid() {
    const { VbankReady, Paid, VbankDodged } = OrderStatus;

    if ([VbankReady, Paid, VbankDodged].includes(this.status)) {
      throw new BadRequestException('완료된 주문을 완료할 수 없습니다');
    }

    this.status = OrderStatus.Paid;
    this.paidAt = new Date();

    for (const orderItem of this.orderItems) {
      orderItem.status = OrderItemStatus.Paid;
      orderItem.paidAt = new Date();
    }
  }

  private markVbankDodged() {
    if (this.status !== OrderStatus.VbankReady) {
      throw new BadRequestException(
        '입금 대기 상태인 주문만 취소할 수 있습니다.'
      );
    }

    this.status = OrderStatus.VbankDodged;
    this.vbankDodgedAt = new Date();

    for (const orderItem of this.orderItems) {
      orderItem.status = OrderItemStatus.VbankDodged;
      orderItem.vbankDodgedAt = new Date();
    }
  }
}
