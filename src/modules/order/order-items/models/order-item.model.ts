import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';
import { Campaign } from '@item/campaigns/models';
import { Item } from '@item/items/models';
import { Product } from '@item/products/models';
import { Seller } from '@item/sellers/models';
import { Coupon } from '@order/coupons/models';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { Order } from '@order/orders/models';
import { RefundRequest } from '@order/refund-requests/models';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { ShipmentFactory } from '@order/shipments/factories';
import { Shipment } from '@order/shipments/models';
import { User } from '@user/users/models';

import { OrderItemStatus, OrderItemClaimStatus } from '../constants';
import { ShipOrderItemInput } from '../dtos';
import { OrderItemEntity } from '../entities';
import { OrderItemMarkStrategyFactory } from '../factories';

@ObjectType()
export class OrderItem extends OrderItemEntity {
  @Field({ description: '[MODEL ONLY]' })
  get id(): string {
    return this.merchantUid;
  }
  @Field(() => Int, { description: '[MODEL ONLY]' })
  get payAmount(): number {
    return (
      this.itemFinalPrice * this.quantity +
      this.shippingFee -
      this.usedPointAmount -
      this.couponDiscountAmount
    );
  }
  @Field({ description: '[MODEL ONLY]' })
  get name(): string {
    return `[${this.brandNameKor}] ${this.itemName} (${this.productVariantName}) ${this.quantity}개`;
  }

  @Field(() => User, { nullable: true })
  @Type(() => User)
  user?: User;
  @Field(() => Seller, { nullable: true })
  @Type(() => Seller)
  seller?: Seller;
  @Field(() => Item, { nullable: true })
  @Type(() => Item)
  item?: Item;
  @Field(() => Product, { nullable: true })
  @Type(() => Product)
  product?: Product;

  @Field(() => Campaign, { nullable: true })
  @Type(() => Campaign)
  campaign: Campaign;
  @Field(() => Digest, { nullable: true })
  @Type(() => Digest)
  recommendDigest: Digest;
  @Field(() => Shipment, { nullable: true })
  @Type(() => Shipment)
  shipment: Shipment;

  @Field(() => Order)
  @Type(() => Order)
  order: Order;
  @Field(() => RefundRequest)
  @Type(() => RefundRequest)
  refundRequest: RefundRequest;
  @Field(() => ExchangeRequest)
  @Type(() => ExchangeRequest)
  exchangeRequest: ExchangeRequest;

  /////////////////
  // 상태변경 함수들 //
  /////////////////

  private markAs(as: OrderItemStatus | OrderItemClaimStatus) {
    OrderItemMarkStrategyFactory.from(as, this).execute();
  }
  markFailed() {
    this.markAs(OrderItemStatus.Failed);
  }
  markVbankReady() {
    this.markAs(OrderItemStatus.VbankReady);
  }
  markVbankDodged() {
    this.markAs(OrderItemStatus.VbankDodged);
  }
  markPaid() {
    this.markAs(OrderItemStatus.Paid);
  }
  markShipReady() {
    this.markAs(OrderItemStatus.ShipReady);
  }
  markCancelled() {
    this.markAs(OrderItemClaimStatus.Cancelled);
  }
  markRefundRequested() {
    this.markAs(OrderItemClaimStatus.RefundRequested);
  }
  markRefunded() {
    this.markAs(OrderItemClaimStatus.Refunded);
  }
  /** to: shipping */
  ship(shipInput: ShipOrderItemInput) {
    this.markAs(OrderItemStatus.Shipping);
    this.shipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.OrderItem,
      ownerPk: this.merchantUid,
      ...shipInput,
    });
  }
  markExchangeRequested() {
    this.markAs(OrderItemClaimStatus.ExchangeRequested);
  }
  markExchanged() {
    this.markAs(OrderItemClaimStatus.Exchanged);
  }
  /** status, claimStatus는 건드리지 않음 */
  confirm() {
    // @TODO: status, claimStatus validate
    this.isConfirmed = true;
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
