import { BadRequestException, NotFoundException } from '@nestjs/common';
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
import { OrderItemProcessStrategyFactory } from '../factories';

import { OrderItemEntity } from '../entities/order-item.entity';

@ObjectType()
export class OrderItem extends OrderItemEntity {
  @Field({ description: '[MODEL ONLY]' })
  get id(): string {
    return this.merchantUid;
  }
  @Field({ description: '상품가격 - 포인트사용액 - 쿠폰할인액' })
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

  /////////////////
  // 상태변경 함수들 //
  /////////////////

  private mark(to: OrderItemStatus | OrderItemClaimStatus) {
    OrderItemProcessStrategyFactory.from(to, this).execute();
  }
  markFailed() {
    this.mark(OrderItemStatus.Failed);
  }
  markVbankReady() {
    this.mark(OrderItemStatus.VbankReady);
  }
  markVbankDodged() {
    this.mark(OrderItemStatus.VbankDodged);
  }
  markPaid() {
    this.mark(OrderItemStatus.Paid);
  }
  markShipReady() {
    this.mark(OrderItemStatus.ShipReady);
  }
  markCancelled() {
    this.mark(OrderItemClaimStatus.Cancelled);
  }
  markRefundRequested() {
    this.mark(OrderItemClaimStatus.RefundRequested);
  }
  /** to: shipping */
  ship(shipInput: ShipOrderItemInput) {
    this.mark(OrderItemStatus.Shipping);
    this.shipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.OrderItem,
      ownerPk: this.merchantUid,
      ...shipInput,
    });
  }
  /** mark as: exchange_requested */
  requestExchange(
    input: RequestOrderItemExchangeInput,
    product: Product
  ): OrderItem {
    this.mark(OrderItemClaimStatus.ExchangeRequested);
    this.exchangeRequest = ExchangeRequestFactory.create(this, product, input);
    return this;
  }

  ///////////////
  // 기타 함수들 //
  //////////////

  useCoupon(coupon: Coupon) {
    if (!coupon) {
      throw new NotFoundException('존재하지 않는 쿠폰입니다.');
    }

    const { item } = this.product;

    if (coupon.checkUsableOn(item)) {
      throw new BadRequestException(`쿠폰[${coupon.id}]를 사용할 수 없습니다.`);
    }

    this.usedCouponId = coupon.id;
    this.usedCouponName = coupon.spec.name;
    this.couponDiscountAmount = coupon.getDiscountAmountFor(item);
  }
}
