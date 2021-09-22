import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemShippingStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.SHIPPING;
  statusChangedField = 'shippingAt' as const;

  validate() {
    if (this.orderItem.status !== OrderItemStatus.SHIP_READY) {
      throw new BadRequestException(
        `배송준비중 상태인 주문 상품만 배송 처리할 수 있습니다.\n문제 주문상품: ${this.orderItem.name})`
      );
    }
  }
}
