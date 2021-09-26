import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderVbankReadyStrategy extends OrderProcessStrategy {
  status = OrderStatus.VbankReady;
  statusChangedField = 'vbankReadyAt' as const;

  validate() {
    if (this.order.status !== OrderStatus.Paying) {
      throw new BadRequestException('결제 완료 처리할 수 없습니다.');
    }
  }

  execute() {
    super.execute();
    for (const orderItem of this.order.orderItems) {
      orderItem.markVbankReady();
    }
  }
}
