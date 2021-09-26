import { BadRequestException } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { findModelById } from '@common/helpers';

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
  StartOrderItemInput,
} from '../dtos';
import { OrderEntity } from '../entities';
import { OrderProcessStrategyFactory } from '../factories';
import { getOrderBrands } from '../helpers';

import { OrderBrand } from './order-brand.model';
import { OrderBuyer } from './order-buyer.model';
import { OrderReceiver } from './order-receiver.model';
import { OrderRefundAccount } from './order-refund-account.model';
import { OrderVbankReceipt } from './order-vbank-receipt.model';

@ObjectType()
export class Order extends OrderEntity {
  @Type(() => OrderItem)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
  @Type(() => RefundRequest)
  @Field(() => [RefundRequest])
  refundRequests: RefundRequest[];

  @Field({ description: '[MODEL ONLY]' })
  get id(): string {
    return this.merchantUid;
  }
  @Field(() => [OrderBrand], { description: '[MODEL ONLY]' })
  get brands(): OrderBrand[] {
    return getOrderBrands(this.orderItems ?? []);
  }
  get availableOrderItems(): OrderItem[] {
    return this.orderItems.filter(
      (oi) =>
        ![
          OrderItemClaimStatus.Cancelled,
          OrderItemClaimStatus.Refunded,
        ].includes(oi.claimStatus)
    );
  }
  @Field(() => Int)
  get totalItemFinalPrice(): number {
    return this.availableOrderItems.reduce(
      (acc, oi) => acc + oi.itemFinalPrice,
      0
    );
  }
  @Field(() => Int)
  get totalShippingFee(): number {
    return this.orderItems.reduce((acc, oi) => acc + oi.shippingFee, 0);
  }
  @Field(() => Int)
  get totalUsedPointAmount(): number {
    return this.availableOrderItems.reduce(
      (acc, oi) => acc + oi.usedPointAmount,
      0
    );
  }
  @Field(() => Int)
  get totalCouponDiscountAmount(): number {
    return this.availableOrderItems.reduce(
      (acc, oi) => acc + oi.couponDiscountAmount,
      0
    );
  }
  @Field(() => Int)
  get totalPayAmount(): number {
    return this.availableOrderItems.reduce((acc, oi) => acc + oi.payAmount, 0);
  }

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
  ): void {
    this.markPaying();
    this.payMethod = input.payMethod;
    this.buyer = new OrderBuyer({ ...input.buyerInput });
    this.receiver = OrderReceiver.from(
      shippingAddress,
      input.receiverInput.message
    );
    if (input.refundAccountInput) {
      this.refundAccount = new OrderRefundAccount({
        ...input.refundAccountInput,
      });
    }

    this.applyUsedPoints(input.usedPointAmount);
    this.applyCoupons(input.orderItemInputs, coupons);
  }

  complete(createOrderVbankReceiptInput?: CreateOrderVbankReceiptInput) {
    if (this.payMethod === PayMethod.Vbank) {
      if (!createOrderVbankReceiptInput) {
        throw new BadRequestException(
          '가상결제 주문건을 완료처리하기 위한 정보가 제공되지 않았습니다.'
        );
      }

      this.markVbankReady();
      this.vbankReceipt = new OrderVbankReceipt(createOrderVbankReceiptInput);
    } else {
      this.markPaid();
    }
  }

  cancel(orderItemMerchantUids: string[]) {
    const beforeAmount = this.totalPayAmount;

    if (orderItemMerchantUids.length === 0) {
      throw new BadRequestException('1개 이상의 주문 상품을 입력해주세요.');
    }

    for (const oi of this.orderItems) {
      if (orderItemMerchantUids.includes(oi.merchantUid)) {
        oi.markCancelled();
      }
    }
    this.applyShippingFees();

    return {
      amount: beforeAmount - this.totalPayAmount,
      checksum: this.totalPayAmount,
    };
  }

  requestRefund(input: RequestOrderRefundInput): void {
    const orderItems = [];

    for (const oi of this.orderItems) {
      if (input.orderItemMerchantUids.includes(oi.merchantUid)) {
        oi.markRefundRequested();
        orderItems.push(oi);
      }
    }

    this.refundRequests.push(
      RefundRequestFactory.create(
        `${this.merchantUid}${this.refundRequests.length}`,
        this.userId,
        orderItems,
        input
      )
    );
  }

  /** evenly spread usedPointAmount to each orderItem */
  private applyUsedPoints(usedPointAmount: number) {
    for (const oi of this.orderItems) {
      oi.usedPointAmount = Math.ceil(
        (oi.itemFinalPrice / this.totalItemFinalPrice) * usedPointAmount
      );
    }

    this.orderItems[0].usedPointAmount +=
      usedPointAmount - this.totalUsedPointAmount;
  }

  private applyCoupons(inputs: StartOrderItemInput[] = [], coupons: Coupon[]) {
    for (const oi of this.orderItems) {
      const input = inputs.find((v) => v.merchantUid === oi.merchantUid);
      if (!input) {
        continue;
      }

      oi.useCoupon(findModelById(input.usedCouponId, coupons));
    }
  }

  /** 각 orderItem의 shippingFee, isFreeShippingPackage를 계산한다.
   * OrderFactory에선 사용할 수 없다. */
  applyShippingFees() {
    const orderBrands = this.brands;

    for (const oi of this.orderItems) {
      const orderBrand = orderBrands.find((v) => v.id === oi.seller.brandId);
      if (!orderBrand) {
        // orderItem의 brand의 모든 상품이 이미 취소된 경우 배송비는 0이다.
        oi.shippingFee = 0;
      } else {
        // 해당 brand에 부과된 배송비가 0이면 무료배송건이다.
        oi.isFreeShippingPackage = orderBrand.shippingFee === 0;
        // 첫번째 orderItem이면 부과된 배송비를, 아니면 0을 부과한다.
        oi.shippingFee =
          orderBrand.items[0].id === oi.id ? orderBrand.shippingFee : 0;
      }
    }
  }
}
