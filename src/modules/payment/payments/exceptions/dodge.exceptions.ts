import { BadRequestException } from '@nestjs/common';

export class StatusInvalidToDodgeException extends BadRequestException {
  constructor() {
    super('해당 결제건은 입금 대기 상태가 아닙니다.');
  }
}
