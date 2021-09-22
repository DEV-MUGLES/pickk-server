import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemVbankDodgedStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.VBANK_DODGED;
  statusChangedField = 'vbankDodgedAt' as const;

  validate() {
    const { PENDING, FAILED } = OrderItemStatus;
    if (![PENDING, FAILED].includes(this.orderItem.status)) {
      throw new BadRequestException(
        `결제된 주문상품을 가상계좌 입금 대기 처리할 수 없습니다\n${this.orderItem.name}`
      );
    }
  }
}
