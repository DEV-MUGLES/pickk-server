import { BadRequestException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';

import { ExchangeRequestMarkStrategy } from './base.strategy';

export class ExchangeRequestReshippingStrategy extends ExchangeRequestMarkStrategy {
  status = ExchangeRequestStatus.Reshipping;
  statusChangedField = 'reshippingAt' as const;

  validate() {
    if (this.exchangeRequest.status !== ExchangeRequestStatus.Picked) {
      throw new BadRequestException(
        `교환요청(${this.exchangeRequest.merchantUid})가 수거완료 상태가 아닙니다.`
      );
    }
  }
}
