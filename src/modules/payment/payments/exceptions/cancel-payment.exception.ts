import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentStatus } from '@pickk/pay';

export class StatusInvalidToCancelException extends BadRequestException {
  constructor(status: PaymentStatus) {
    super(`[${status}] 상태인 결제건은 취소할 수 없습니다.`);
  }
}

export class NotEnoughRemainAmountException extends ConflictException {
  constructor() {
    super('취소 요청된 금액이 취소가능 잔액보다 많습니다.');
  }
}

export class InconsistentChecksumException extends ConflictException {
  constructor() {
    super('제출된 checksum이 저장되어 있는 취소가능 잔액과 일치하지 않습니다.');
  }
}

export class NotJoinedCancelException extends InternalServerErrorException {
  constructor() {
    super('결제건을 취소하기 위해서 반드시 cancellations를 join해야합니다.');
  }
}

export class VbankRefundInfoRequiredException extends BadRequestException {
  constructor() {
    super(
      '가상계좌 결제건을 취소하기 위한 환불계좌 정보가 제공되지 않았습니다.'
    );
  }
}
