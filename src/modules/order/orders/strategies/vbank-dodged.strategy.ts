import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderVbankDodgedStrategy extends OrderProcessStrategy {
  status = OrderStatus.VBANK_DODGED;
  statusChangedField = 'vbankDodgedAt' as const;

  validate() {
    if (this.order.status !== OrderStatus.VBANK_READY) {
      throw new BadRequestException(
        '입금 대기 상태인 주문만 취소할 수 있습니다.'
      );
    }
  }

  execute() {
    super.execute();
    for (const orderItem of this.order.orderItems) {
      orderItem.markVbankDodged();
    }
  }
}
