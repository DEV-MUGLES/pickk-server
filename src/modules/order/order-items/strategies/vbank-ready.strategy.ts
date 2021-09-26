import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemVbankReadyStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.VbankReady;
  statusChangedField = 'vbankReadyAt' as const;

  validate() {
    const { Pending, Failed } = OrderItemStatus;
    if (![Pending, Failed].includes(this.orderItem.status)) {
      throw new BadRequestException(
        `아래 주문상품을 결제 처리할 수 없습니다\n${this.orderItem.name}`
      );
    }
  }
}
