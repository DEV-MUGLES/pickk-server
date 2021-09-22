import { BadRequestException } from '@nestjs/common';

import { RefundRequestStatus } from '../constants';

import { RefundRequestMarkStrategy } from './base.strategy';

export class RefundRequestConfirmedStrategy extends RefundRequestMarkStrategy {
  status = RefundRequestStatus.CONFIRMED;
  statusChangedField = 'confirmedAt' as const;

  validate() {
    if (this.refundRequest.status !== RefundRequestStatus.PICKED) {
      throw new BadRequestException(
        `교환요청(${this.refundRequest.merchantUid})가 수거완료 상태가 아닙니다.`
      );
    }
  }

  execute() {
    super.execute();
    this.refundRequest.orderItems.forEach((oi) => oi.markRefunded());
  }
}
