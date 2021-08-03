import { BadRequestException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models';
import { Order } from '@order/orders/models';

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

  @Field({ name: 'Order' })
  order: Order;

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

  private markCancelled() {
    if (this.status !== OrderItemStatus.Paid) {
      throw new BadRequestException(
        `결제 완료 상태인 주문 상품만 취소할 수 있습니다.\n문제 주문상품: ${this.itemName}(${this.productVariantName})`
      );
    }

    this.claimStatus = OrderItemClaimStatus.Cancelled;
    this.cancelledAt = new Date();
  }
}
