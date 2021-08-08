import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { Order } from '@order/orders/models';
import { RefundRequest } from '@order/refund-requests/models/refund-request.model';

import { OrderItemStatus, OrderItemClaimStatus } from '../constants';
import { OrderItemEntity } from '../entities/order-item.entity';

@ObjectType()
export class OrderItem extends OrderItemEntity {
  @Field({
    description:
      'ApolloClient 최적화를 위한 필드입니다. DB에는 존재하지 않습니다.',
  })
  get id(): string {
    return this.merchantUid;
  }

  @Field({
    description: 'itemFinalPrice - usedPointAmount - couponDiscountAmount',
  })
  get payAmount(): number {
    return (
      this.itemFinalPrice - this.usedPointAmount - this.couponDiscountAmount
    );
  }

  @Field()
  order: Order;

  @Field()
  refundRequest: RefundRequest;

  @Field(() => ExchangeRequest)
  exchangeRequest: ExchangeRequest;

  useCoupon(coupon: Coupon) {
    const { item } = this.product;

    if (coupon.checkUsableOn(item)) {
      throw new BadRequestException(`쿠폰[${coupon.id}]를 사용할 수 없습니다.`);
    }

    this.usedCouponId = coupon.id;
    this.usedCouponName = coupon.spec.name;
    this.couponDiscountAmount = coupon.getDiscountAmountFor(item);
  }

  cancel() {
    this.markCancelled();
  }

  requestRefund() {
    this.markRefundRequested();
  }

  requestExchange(exchangeRequest: ExchangeRequest) {
    if (!exchangeRequest.product) {
      throw new InternalServerErrorException(
        'exchangeRequest의 product를 Join해야합니다.'
      );
    }
    console.log(this.itemId, exchangeRequest);
    if (this.itemId !== exchangeRequest.product.itemId) {
      throw new BadRequestException(
        '같은 아이템의 Product로만 교환할 수 있습니다.'
      );
    }
    if (this.quantity !== exchangeRequest.quantity) {
      throw new InternalServerErrorException(
        '요청된 교환신청의 상품 개수가 주문상품과 다릅니다.'
      );
    }
    // @TODO: shippingFee validate

    this.markExchangeRequested();
    this.exchangeRequest = exchangeRequest;
  }

  private markCancelled() {
    if (this.status !== OrderItemStatus.Paid) {
      throw new BadRequestException(
        `결제 완료 상태인 주문 상품만 취소할 수 있습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }

    this.claimStatus = OrderItemClaimStatus.Cancelled;
    this.cancelledAt = new Date();
  }

  private markRefundRequested() {
    const { ShipReady, Shipping, Shipped } = OrderItemStatus;

    if (![ShipReady, Shipping, Shipped].includes(this.status)) {
      throw new BadRequestException(
        `배송준비중/배송중/배송완료 상태인 주문 상품만 반품 신청할 수 있습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }
    if (this.claimStatus !== null) {
      throw new BadRequestException(
        `이미 ${this.claimStatus} 상태인 주문상품은 반품할 수 없습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }

    this.claimStatus = OrderItemClaimStatus.RefundRequested;
    this.refundRequestedAt = new Date();
  }

  private markExchangeRequested() {
    const { ShipReady, Shipping, Shipped } = OrderItemStatus;

    if (![ShipReady, Shipping, Shipped].includes(this.status)) {
      throw new BadRequestException(
        `배송준비중/배송중/배송완료 상태인 주문 상품만 교환 신청할 수 있습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }
    if (this.claimStatus !== null) {
      throw new BadRequestException(
        `이미 ${this.claimStatus} 상태인 주문상품은 교환신청 수 없습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }

    this.claimStatus = OrderItemClaimStatus.ExchangeRequested;
    this.exchangeRequestedAt = new Date();
  }
}
