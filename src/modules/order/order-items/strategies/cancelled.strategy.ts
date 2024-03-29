import { BadRequestException } from '@nestjs/common';

import { OrderItemClaimStatus, OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemCancelledStrategy extends OrderItemMarkStrategy {
  status = OrderItemClaimStatus.Cancelled;
  statusChangedField = 'cancelledAt' as const;

  validate() {
    const { Paid, ShipReady } = OrderItemStatus;
    if (![Paid, ShipReady].includes(this.orderItem.status)) {
      throw new BadRequestException(
        `${this.orderItem.status} 상태인 주문 상품은 취소할 수 없습니다.\n문제 주문상품: ${this.orderItem.name})`
      );
    }
    if (this.orderItem.claimStatus != null) {
      throw new BadRequestException(
        `이미 ${this.orderItem.claimStatus} 상태인 주문상품은 취소할 수 없습니다.\n문제 주문상품: ${this.orderItem.name})`
      );
    }
  }
}
