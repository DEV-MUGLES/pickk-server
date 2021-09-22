import { BadRequestException } from '@nestjs/common';

import { OrderItemClaimStatus } from '../constants';

import { OrderItemMarkStrategy } from './base.strategy';

export class OrderItemRefundedStrategy extends OrderItemMarkStrategy {
  status = OrderItemClaimStatus.Refunded;
  statusChangedField = 'refundedAt' as const;

  validate() {
    if (this.orderItem.claimStatus !== OrderItemClaimStatus.RefundRequested) {
      throw new BadRequestException(
        `주문상품(${this.orderItem.merchantUid})가 반품요청됨 상태가 아닙니다.`
      );
    }
  }
}
