import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Coupon } from '@order/coupons/models';
import { OrderItemClaimStatus } from '@order/order-items/constants';
import { OrderItem } from '@order/order-items/models';
import { RefundRequestFactory } from '@order/refund-requests/factories';
import { RefundRequest } from '@order/refund-requests/models';
import { PayMethod } from '@payment/payments/constants';
import { ShippingAddress } from '@user/users/models';

import { OrderStatus } from '../constants';
import {
  CreateOrderVbankReceiptInput,
  RequestOrderRefundInput,
  StartOrderInput,
} from '../dtos';
import { OrderEntity } from '../entities';
import { OrderProcessStrategyFactory } from '../factories';
import { calcTotalShippingFee, getOrderBrands } from '../helpers';

import { OrderBrand } from './order-brand.model';
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
  @Field(() => [OrderBrand], { description: '[MODEL ONLY]' })
  get brands(): OrderBrand[] {
    return getOrderBrands(this.orderItems ?? []);
  }

  @Type(() => OrderItem)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
  @Type(() => RefundRequest)
  @Field(() => [RefundRequest])
  refundRequests: RefundRequest[];

  /////////////////
  // 상태변경 함수들 //
  /////////////////

  private mark(to: OrderStatus) {
    OrderProcessStrategyFactory.from(to, this).execute();
  }
  markFailed() {
    this.mark(OrderStatus.Failed);
  }
  markPaying() {
    this.mark(OrderStatus.Paying);
  }
  markVbankReady() {
    this.mark(OrderStatus.VbankReady);
  }
  markVbankDodged() {
    this.mark(OrderStatus.VbankDodged);
  }
  markPaid() {
    this.mark(OrderStatus.Paid);
  }

  ///////////////
  // 기타 함수들 //
  //////////////

  start(
    input: StartOrderInput,
    shippingAddress: ShippingAddress,
    coupons: Coupon[]
  ) {
    this.payMethod = input.payMethod;
    this.totalUsedPointAmount = input.usedPointAmount;
    this.spreadUsedPoint(input.usedPointAmount);
    this.buyer = new OrderBuyer({ ...input.buyerInput });
    this.receiver = OrderReceiver.from(
      shippingAddress,
      input.receiverInput.message
    );
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

  cancel(orderItemMerchantUids: string[]) {
    const beforeAmount = this.totalPayAmount;

    if (orderItemMerchantUids.length === 0) {
      throw new BadRequestException('1개 이상의 주문 상품을 입력해주세요.');
    }

    for (const merchantUid of orderItemMerchantUids) {
      const orderItem = this.getOrderItem(merchantUid);
      orderItem.markCancelled();

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

    return {
      amount: this.totalPayAmount,
      checksum: beforeAmount - this.totalPayAmount,
    };
  }

  requestRefund(input: RequestOrderRefundInput): void {
    for (const oi of this.orderItems) {
      if (input.orderItemMerchantUids.includes(oi.merchantUid)) {
        oi.markRefundRequested();
      }
    }

    this.refundRequests.push(
      RefundRequestFactory.create(this.userId, this.orderItems, input)
    );
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
    return orderItem;
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
}
