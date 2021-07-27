import { BadRequestException } from '@nestjs/common';

import { PaymentStatus } from '../constants';

export class StatusInvalidToFailException extends BadRequestException {
  constructor(status: PaymentStatus) {
    super(`[${status}] 상태인 결제건은 실패 처리할 수 없습니다.`);
  }
}
