import { BadRequestException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';

import { ExchangeRequestMarkStrategy } from './base.strategy';

export class ExchangeRequestRequestedStrategy extends ExchangeRequestMarkStrategy {
  status = ExchangeRequestStatus.Requested;
  statusChangedField = 'requestedAt' as const;

  validate() {
    if (this.exchangeRequest.status !== ExchangeRequestStatus.Pending) {
      throw new BadRequestException(
        `교환신청(${this.exchangeRequest.merchantUid})을 처리할 수 없습니다.`
      );
    }
  }

  execute() {
    super.execute();
    this.exchangeRequest.orderItem.markExchangeRequested();
  }
}
