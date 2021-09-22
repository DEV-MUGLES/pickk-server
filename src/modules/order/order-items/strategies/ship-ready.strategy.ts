import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemShipReadyStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.SHIP_READY;
  statusChangedField = 'shipReadyAt' as const;

  validate() {
    if (this.orderItem.status !== OrderItemStatus.PAID) {
      throw new BadRequestException(
        `결제완료 상태인 주문 상품만 발주 완료할 수 있습니다.\n문제 주문상품: ${this.orderItem.name})`
      );
    }
  }
}
