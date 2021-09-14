import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemProcessStrategy } from './base.strategy';

export class OrderItemFailedStrategy extends OrderItemProcessStrategy {
  status = OrderItemStatus.Failed;
  statusChangedField = 'failedAt' as const;

  validate() {
    const { Pending, Failed } = OrderItemStatus;
    if (![Pending, Failed].includes(this.orderItem.status)) {
      throw new BadRequestException(
        `결제된 주문상품을 실패처리할 수 없습니다\n${this.orderItem.name}`
      );
    }
  }
}
