import { BadRequestException } from '@nestjs/common';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';

import { OrderItemProcessStrategy } from './base.strategy';

export class OrderItemRefundRequestedStrategy extends OrderItemProcessStrategy {
  status = OrderItemClaimStatus.RefundRequested;
  statusChangedField = 'refundRequestedAt' as const;

  validate() {
    const { ShipReady, Shipping, Shipped } = OrderItemStatus;

    if (![ShipReady, Shipping, Shipped].includes(this.orderItem.status)) {
      throw new BadRequestException(
        `배송준비중/배송중/배송완료 상태인 주문 상품만 반품 신청할 수 있습니다.\n문제 주문상품: ${this.orderItem.name})`
      );
    }
    if (this.orderItem.claimStatus !== null) {
      throw new BadRequestException(
        `이미 ${this.orderItem.claimStatus} 상태인 주문상품은 반품할 수 없습니다.\n문제 주문상품: ${this.orderItem.name})`
      );
    }
  }
}