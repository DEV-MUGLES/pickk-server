import { BadRequestException } from '@nestjs/common';

import { PaymentStatus } from '../constants';

export class StatusInvalidToVbankPayException extends BadRequestException {
  constructor(status: PaymentStatus) {
    super(`[${status}] 상태인 결제건은 가상결제 완료처리할 수 없습니다.`);
  }
}
