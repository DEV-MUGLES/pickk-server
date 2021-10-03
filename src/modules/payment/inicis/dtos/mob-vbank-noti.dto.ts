import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IniapiGetTransactionResult, MobpayVbankNoti } from 'inicis';

import { BankCode } from '@common/constants';
import { isAllEleSame } from '@common/helpers';
import { PaymentStatus, PayMethod, Pg } from '@payment/payments/constants';
import { Payment } from '@payment/payments/models';

import {
  StatusInvalidToVbankDepositException,
  VbankInvalidPricesException,
} from '../exceptions';

export class InicisMobVbankNotiDto
  implements Omit<MobpayVbankNoti, 'P_FN_CD1'>
{
  static validate(
    dto: InicisMobVbankNotiDto,
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
        dto.P_AMT.toString(),
        payment.amount.toString(),
        transaction.price.toString(),
      ])
    ) {
      throw new VbankInvalidPricesException(
        dto.P_AMT,
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

  P_STATUS: '00' | '02';

  P_TID: string;

  @ApiProperty({ type: 'VBANK' })
  P_TYPE: 'VBANK';

  P_AUTH_DT: string;

  P_MID: string;

  P_OID: string;

  P_FN_CD1: BankCode;

  @ApiProperty({ type: '' })
  P_FN_CD2: '';

  P_FN_NM: string;

  P_AMT: number;

  P_UNAME: string;

  P_RMESG1: string;

  P_RMESG2: string;

  P_NOTI: string;

  @ApiProperty({ type: '' })
  P_AUTH_NO: '';

  P_CSHR_AMT?: number;

  P_CSHR_SUP_AMT?: number;

  P_CSHR_TAX?: number;

  P_CSHR_SRVC_AMT?: number;

  P_CSHR_TYPE?: '0' | '1';

  P_CSHR_DT?: string;

  P_CSHR_AUTH_NO?: string;
}
