import { BadRequestException } from '@nestjs/common';

import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderFailedStrategy extends OrderProcessStrategy {
  status = OrderStatus.FAILED;
  statusChangedField = 'failedAt' as const;

  validate() {
    const { PENDING, FAILED } = OrderStatus;
    if (![PENDING, FAILED].includes(this.order.status)) {
      throw new BadRequestException('완료된 주문을 실패처리할 수 없습니다');
    }
  }

  execute() {
    super.execute();
    for (const orderItem of this.order.orderItems) {
      orderItem.markFailed();
    }
  }
}
