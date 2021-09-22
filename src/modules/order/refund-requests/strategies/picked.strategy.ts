import { BadRequestException } from '@nestjs/common';

import { RefundRequestStatus } from '../constants';

import { RefundRequestMarkStrategy } from './base.strategy';

export class RefundRequestPickedStrategy extends RefundRequestMarkStrategy {
  status = RefundRequestStatus.PICKED;
  statusChangedField = 'pickedAt' as const;

  validate() {
    if (this.refundRequest.status !== RefundRequestStatus.REQUESTED) {
      throw new BadRequestException(
        `반품요청(${this.refundRequest.merchantUid})가 요청됨 상태가 아닙니다.`
      );
    }
  }
}
