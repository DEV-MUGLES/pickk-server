import { BadRequestException } from '@nestjs/common';

import { ExchangeRequest } from '../models';

export class InvalidExchangeShippingFeeException extends BadRequestException {
  constructor(exchangeRequest: ExchangeRequest, paidAmount: number) {
    super(
      `결제된 배송비가 잘못됐습니다.\n결제번호: ${exchangeRequest.merchantUid}, 결제됨: ${paidAmount}, 예상: ${exchangeRequest.shippingFee}`
    );
  }
}
