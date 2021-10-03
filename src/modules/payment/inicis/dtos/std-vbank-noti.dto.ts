import { BadRequestException } from '@nestjs/common';
import { IniapiGetTransactionResult, StdpayVbankNoti } from 'inicis';

import { BankCode } from '@common/constants';
import { isAllEleSame } from '@common/helpers';

import { Pg, PayMethod, PaymentStatus } from '@payment/payments/constants';
import { Payment } from '@payment/payments/models';

import {
  StatusInvalidToVbankDepositException,
  VbankInvalidPricesException,
} from '../exceptions';

export class InicisStdVbankNotiDto
  implements Omit<StdpayVbankNoti, 'cd_bank' | 'cd_deal'>
{
  constructor(attributes: InicisStdVbankNotiDto) {
    Object.assign(this, attributes);
  }

  public static validate(
    dto: InicisStdVbankNotiDto,
    payment: Payment,
    transaction: IniapiGetTransactionResult
  ): boolean {
    if (payment.pg !== Pg.Inicis) {
      throw new BadRequestException(
        '[KG이니시스 가상계좌 입금통보] 이니시스 거래건이 아닙니다.'
      );
    }
    if (payment.payMethod !== PayMethod.Vbank) {
      throw new BadRequestException(
        `[KG이니시스 가상계좌 입금통보] 가상계좌 거래건이 아닙니다. (지불수단: ${payment.payMethod})`
      );
    }
    if (payment.status !== PaymentStatus.VbankReady) {
      throw new StatusInvalidToVbankDepositException(payment.status);
    }
    if (
      !isAllEleSame([
        dto.amt_input.toString(),
        payment.amount.toString(),
        transaction.price.toString(),
      ])
    ) {
      throw new VbankInvalidPricesException(
        dto.amt_input,
        payment.amount,
        transaction.price
      );
    }
    if (transaction.status !== 'Y') {
      throw new BadRequestException(
        '[KG이니시스 가상계좌 입금통보] 입금완료되지 않은 거래입니다.'
      );
    }
    return true;
  }

  no_tid: string;

  no_oid: string;

  cd_bank: BankCode;

  cd_deal: BankCode;

  dt_trans: string;

  tm_Trans: string;

  no_vacct: string;

  amt_input: number;

  flg_close: '0' | '1';

  cl_close: '0' | '1';

  type_msg: string;

  nm_inputbank: string;

  nm_input: string;

  dt_inputstd: string;

  dt_calculstd: string;

  dt_transbase: string;

  cl_trans: string;

  cl_kor: string;

  dt_cshr?: string;

  tm_cshr?: string;

  no_cshr_appl?: string;

  no_cshr_tid?: string;
}
