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
import { OrderItemMarkStrategyFactory } from '../factories';

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

  private markAs(as: OrderItemStatus | OrderItemClaimStatus) {
    OrderItemMarkStrategyFactory.from(as, this).execute();
  }
  markFailed() {
    this.markAs(OrderItemStatus.FAILED);
  }
  markVbankReady() {
    this.markAs(OrderItemStatus.VBANK_READY);
  }
  markVbankDodged() {
    this.markAs(OrderItemStatus.VBANK_DODGED);
  }
  markPaid() {
    this.markAs(OrderItemStatus.PAID);
  }
  markShipReady() {
    this.markAs(OrderItemStatus.SHIP_READY);
  }
  markCancelled() {
    this.markAs(OrderItemClaimStatus.CANCELLED);
  }
  markRefundRequested() {
    this.markAs(OrderItemClaimStatus.REFUND_REQUESTED);
  }
  markRefunded() {
    this.markAs(OrderItemClaimStatus.REFUNDED);
  }
  /** to: shipping */
  ship(shipInput: ShipOrderItemInput) {
    this.markAs(OrderItemStatus.SHIPPING);
    this.shipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.ORDER_ITEM,
      ownerPk: this.merchantUid,
      ...shipInput,
    });
  }
  /** mark as: exchange_requested */
  requestExchange(
    input: RequestOrderItemExchangeInput,
    product: Product
  ): OrderItem {
    this.markAs(OrderItemClaimStatus.EXCHANGE_REQUESTED);
    this.exchangeRequest = ExchangeRequestFactory.create(this, product, input);
    return this;
  }
  markExchanged() {
    this.markAs(OrderItemClaimStatus.EXCHANGED);
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
