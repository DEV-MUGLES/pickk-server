import { BadRequestException, ConflictException } from '@nestjs/common';

import { PaymentStatus } from '@payment/payments/constants';

export class AbnormalVbankNotiException extends BadRequestException {
  constructor() {
    super(
      '[KG이니시스 가상계좌 입금통보] 정상처리되지 않은 가상계좌알림입니다.'
    );
  }
}

export class StatusInvalidToVbankDepositException extends BadRequestException {
  constructor(status: PaymentStatus) {
    super(
      `[KG이니시스 가상계좌 입금통보] ${status} 상태인 결제건은 입금처리할 수 없습니다.`
    );
  }
}

export class VbankInvalidPricesException extends ConflictException {
  constructor(
    inputAmount: number,
    paymentAmount: number,
    transactionAmount: number
  ) {
    let message = '[KG이니시스 가상계좌 입금통보] ';
    message += '금액 정보가 일치하지 않습니다.\n';
    message += `입금금액:${inputAmount}, `;
    message += `저장금액(DB):${paymentAmount}, `;
    message += `저장금액(이니시스):${transactionAmount}`;

    super(message);
  }
}
