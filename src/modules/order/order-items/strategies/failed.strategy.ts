import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemFailedStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.FAILED;
  statusChangedField = 'failedAt' as const;

  validate() {
    const { PENDING, FAILED } = OrderItemStatus;
    if (![PENDING, FAILED].includes(this.orderItem.status)) {
      throw new BadRequestException(
        `결제된 주문상품을 실패처리할 수 없습니다\n${this.orderItem.name}`
      );
    }
  }
}
