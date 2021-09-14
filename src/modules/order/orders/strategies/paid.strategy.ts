import { BadRequestException } from '@nestjs/common';

import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderPaidStrategy extends OrderProcessStrategy {
  status = OrderStatus.Paid;
  statusChangedField = 'paidAt' as const;

  validate() {
    const { Pending, VbankReady } = OrderStatus;
    if (![Pending, VbankReady].includes(this.order.status)) {
      throw new BadRequestException('결제 완료 처리할 수 없습니다.');
    }
  }

  execute() {
    super.execute();
    for (const orderItem of this.order.orderItems) {
      orderItem.markPaid();
    }
  }
}
