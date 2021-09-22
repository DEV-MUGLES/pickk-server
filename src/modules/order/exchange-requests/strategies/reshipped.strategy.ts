import { BadRequestException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';

import { ExchangeRequestMarkStrategy } from './base.strategy';

export class ExchangeRequestReshippedStrategy extends ExchangeRequestMarkStrategy {
  status = ExchangeRequestStatus.RESHIPPED;
  statusChangedField = 'reshippedAt' as const;

  validate() {
    if (this.exchangeRequest.status !== ExchangeRequestStatus.RESHIPPING) {
      throw new BadRequestException(
        `교환요청(${this.exchangeRequest.merchantUid})가 재배송중 상태가 아닙니다.`
      );
    }
  }

  execute() {
    super.execute();
    this.exchangeRequest.orderItem.markExchanged();
  }
}
