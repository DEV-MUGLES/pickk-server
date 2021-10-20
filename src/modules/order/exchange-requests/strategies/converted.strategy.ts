import { BadRequestException } from '@nestjs/common';

import { ExchangeRequestStatus } from '../constants';

import { ExchangeRequestMarkStrategy } from './base.strategy';

export class ExchangeRequestConvertedStrategy extends ExchangeRequestMarkStrategy {
  status = ExchangeRequestStatus.Converted;
  statusChangedField = 'convertedAt' as const;

  validate() {
    const { Requested, Picked } = ExchangeRequestStatus;
    if ([Requested, Picked].includes(this.exchangeRequest.status)) {
      throw new BadRequestException(
        `${this.exchangeRequest.status} 상태인 교환요청은 변경할 수 없습니다.`
      );
    }
  }

  execute() {
    super.execute();
    this.exchangeRequest.orderItem.claimStatus = null;
    this.exchangeRequest.orderItem.markRefundRequested();
  }
}
