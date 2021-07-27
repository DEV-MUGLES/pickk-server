import { BadRequestException } from '@nestjs/common';

import { PaymentStatus } from '../constants';

export class StatusInvalidToCompleteException extends BadRequestException {
  constructor(status: PaymentStatus) {
    super(`[${status}] 상태인 결제건은 완료 처리할 수 없습니다.`);
  }
}
