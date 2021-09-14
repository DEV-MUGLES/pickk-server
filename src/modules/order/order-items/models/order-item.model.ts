import { BadRequestException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Product } from '@item/products/models';
import { Coupon } from '@order/coupons/models';
import { ExchangeRequestFactory } from '@order/exchange-requests/factories';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { Order } from '@order/orders/models';
import { RefundRequest } from '@order/refund-requests/models';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { ShipmentFactory } from '@order/shipments/factories';

import { OrderItemStatus, OrderItemClaimStatus } from '../constants';
import { RequestOrderItemExchangeInput, ShipOrderItemInput } from '../dtos';
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
  get name(): string {
    return `[${this.brandNameKor}] ${this.itemName} (${this.productVariantName}) ${this.quantity}개`;
  }

  @Type(() => Order)
  @Field(() => Order)
  order: Order;

  @Type(() => RefundRequest)
  @Field(() => RefundRequest)
  refundRequest: RefundRequest;

  @Type(() => ExchangeRequest)
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

  ship(shipInput: ShipOrderItemInput) {
    if (this.status !== OrderItemStatus.ShipReady) {
      throw new BadRequestException(
        `배송준비중 상태인 주문 상품만 배송 처리할 수 있습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }

    this.markShipping();
    this.shipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.OrderItem,
      ownerPk: this.merchantUid,
      ...shipInput,
    });
  }

  cancel() {
    this.markCancelled();
  }

  requestRefund() {
    this.markRefundRequested();
  }

  requestExchange(input: RequestOrderItemExchangeInput, product: Product) {
    this.exchangeRequest = ExchangeRequestFactory.create(this, product, input);
    this.markExchangeRequested();
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

  private markShipping() {
    this.status = OrderItemStatus.Shipping;
    this.shippingAt = new Date();
  }
}
