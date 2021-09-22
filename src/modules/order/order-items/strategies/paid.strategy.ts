import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemPaidStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.PAID;
  statusChangedField = 'paidAt' as const;

  validate() {
    if (this.orderItem.status !== OrderItemStatus.PENDING) {
      throw new BadRequestException(
        `아래 주문상품을 결제 처리할 수 없습니다\n${this.orderItem.name}`
      );
    }
  }
}
