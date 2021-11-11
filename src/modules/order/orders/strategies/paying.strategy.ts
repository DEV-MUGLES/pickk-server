import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderPayingStrategy extends OrderProcessStrategy {
  status = OrderStatus.Paying;
  statusChangedField = 'payingAt' as const;

  validate() {
    const { Pending, Paying, Failed } = OrderStatus;
    if (![Pending, Paying, Failed].includes(this.order.status)) {
      throw new BadRequestException('이미 완료된 주문입니다.');
    }
    if (this.order.totalPayAmount < 0) {
      throw new BadRequestException('총 결제금액이 음수일 수 없습니다.');
    }
  }
}
