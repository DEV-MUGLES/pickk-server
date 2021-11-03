import { BadRequestException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';

import { ExchangeRequestMarkStrategy } from './base.strategy';

export class ExchangeRequestRejectedStrategy extends ExchangeRequestMarkStrategy {
  status = ExchangeRequestStatus.Rejected;
  statusChangedField = 'rejectedAt' as const;

  validate() {
    if (
      this.exchangeRequest.status !== ExchangeRequestStatus.Picked &&
      this.exchangeRequest.status !== ExchangeRequestStatus.Requested
    ) {
      throw new BadRequestException(
        `교환요청(${this.exchangeRequest.merchantUid})가 요청됨 또는 수거완료 상태가 아닙니다.`
      );
    }
  }
}
