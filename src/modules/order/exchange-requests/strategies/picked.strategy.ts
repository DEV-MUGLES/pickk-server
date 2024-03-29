import { BadRequestException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';

import { ExchangeRequestMarkStrategy } from './base.strategy';

export class ExchangeRequestPickedStrategy extends ExchangeRequestMarkStrategy {
  status = ExchangeRequestStatus.Picked;
  statusChangedField = 'pickedAt' as const;

  validate() {
    if (this.exchangeRequest.status !== ExchangeRequestStatus.Requested) {
      throw new BadRequestException(
        `교환요청(${this.exchangeRequest.merchantUid})가 요청됨 상태가 아닙니다.`
      );
    }
  }
}
