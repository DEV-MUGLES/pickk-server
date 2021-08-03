import { BadRequestException } from '@nestjs/common';

export class InvalidCancelAmountException extends BadRequestException {
  constructor(cancelledAmount: number, givenAmount: number) {
    super(
      `제공된 amount가 취소된 환불 금액과 일치하지 않습니다.\namount: ${givenAmount}, 취소된 환불 금액: ${cancelledAmount}`
    );
  }
}
