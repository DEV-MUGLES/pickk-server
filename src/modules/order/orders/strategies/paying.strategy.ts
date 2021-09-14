import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderPayingStrategy extends OrderProcessStrategy {
  status = OrderStatus.Paying;
  statusChangedField = 'payingAt' as const;

  validate() {
    const { Pending, Failed } = OrderStatus;
    if (![Pending, Failed].includes(this.order.status)) {
      throw new BadRequestException('이미 완료된 주문입니다.');
    }
  }
}
