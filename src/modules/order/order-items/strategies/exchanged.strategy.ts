import { BadRequestException } from '@nestjs/common';

import { OrderItemClaimStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemExchangedStrategy extends OrderItemMarkStrategy {
  status = OrderItemClaimStatus.Exchanged;
  statusChangedField = 'exchangedAt' as const;

  validate() {
    if (this.orderItem.claimStatus !== OrderItemClaimStatus.ExchangeRequested) {
      throw new BadRequestException(
        `주문상품(${this.orderItem.merchantUid})가 교환요청됨 상태가 아닙니다.`
      );
    }
  }
}
