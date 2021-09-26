import { BadRequestException } from '@nestjs/common';

import { OrderItemStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemVbankDodgedStrategy extends OrderItemMarkStrategy {
  status = OrderItemStatus.VbankDodged;
  statusChangedField = 'vbankDodgedAt' as const;

  validate() {
    if (this.orderItem.status !== OrderItemStatus.VbankReady) {
      throw new BadRequestException(
        `invalid orderItem status \n${this.orderItem.name}, ${this.orderItem.status}`
      );
    }
  }
}
