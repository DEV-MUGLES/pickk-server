import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemVbankReadyStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.VbankReady;
  statusChangedField = 'vbankReadyAt' as const;

  validate() {
    if (this.orderItem.status !== OrderItemStatus.VbankReady) {
      throw new BadRequestException(
        `입금 대기 상태인 주문만 취소할 수 있습니다.\n${this.orderItem.name}`
      );
    }
  }
}
