import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

export class InicisCancelFailedException extends InternalServerErrorException {
  constructor(resultMsg: string) {
    super('KG이니시스 취소실패: ' + resultMsg);
  }
}

export class NotFromInicisException extends ForbiddenException {
  constructor(funcName: string) {
    super(`[${funcName}] 이니시스 PG로부터의 요청만 허용됩니다.`);
  }
}

export class InicisGetTransactionFailedException extends InternalServerErrorException {
  constructor(resultMsg: string) {
    super('KG이니시스 거래조회실패: ' + resultMsg);
  }
}
