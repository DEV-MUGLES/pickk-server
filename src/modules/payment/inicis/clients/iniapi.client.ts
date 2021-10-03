import crypto from 'crypto';
import dayjs from 'dayjs';
import {
  IniapiRefundRequestParams,
  IniapiPartialRefundRequestParams,
  IniapiVacctRefundRequestParams,
  hash,
  IniapiCommonRequestParams,
  IniapiGetTransactionRequestParams,
  IniapiPaymethod,
} from 'inicis';

import { PayMethod } from '@payment/payments/constants';
import { Payment } from '@payment/payments/models';

import { INICIS_INIAPI_IV, INICIS_INIAPI_KEY, INICIS_MID } from '../constants';
import { InicisCancelDto } from '../dtos';
import { toIniapiPayMethod } from '../serializers';

const aes = (data: string) => {
  if (!data) {
    return data;
  }

  const cipher = crypto.createCipheriv(
    'aes-128-cbc',
    INICIS_INIAPI_KEY,
    INICIS_INIAPI_IV
  );

  return (
    cipher.update(data).toString('base64') + cipher.final().toString('base64')
  );
};

export class IniapiClient {
  private get iniapiMap(): IniapiCommonRequestParams {
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const clientIp = '127.0.0.1';
    const mid = INICIS_MID;

    return { timestamp, clientIp, mid };
  }

  public getDodgeVbankParams(payment: Payment): IniapiRefundRequestParams {
    const { timestamp, clientIp, mid } = this.iniapiMap;
    const paymethod = IniapiPaymethod.GVacct;
    const type = 'Refund';
    const tid = payment.pgTid;
    const msg = '입금 전 취소 (채번)';

    const getHashDataString = (type: string) =>
      INICIS_INIAPI_KEY + type + paymethod + timestamp + clientIp + mid + tid;

    return {
      paymethod,
      timestamp,
      mid,
      tid,
      msg,
      type,
      clientIp: '127.0.0.1',
      hashData: hash(getHashDataString('Refund'), 'RSA-SHA512'),
    };
  }

  public getCancelParams(
    dto: InicisCancelDto
  ):
    | IniapiRefundRequestParams
    | IniapiPartialRefundRequestParams
    | IniapiVacctRefundRequestParams {
    const { cancelledPayment, amount, reason, taxFree = 0 } = dto;

    const { timestamp, clientIp, mid } = this.iniapiMap;
    const paymethod = toIniapiPayMethod(cancelledPayment.payMethod);
    const tid = cancelledPayment.pgTid;
    const msg = reason;

    const refundAcctNum = aes(dto.refundVbankNum) || '';

    const getHashDataString = (type: string) =>
      INICIS_INIAPI_KEY + type + paymethod + timestamp + clientIp + mid + tid;

    const params: Omit<IniapiRefundRequestParams, 'type' | 'hashData'> = {
      paymethod,
      timestamp,
      mid,
      tid,
      msg,
      clientIp: '127.0.0.1',
      ...(cancelledPayment.payMethod === PayMethod.Vbank && {
        refundAcctNum,
        refundBankCode: dto.refundVbankCode,
        refundAcctName: dto.refundVbankHolder,
      }),
    };

    // 전액 취소인 경우 (주의: 최초 결제시 결제한 금액을 모두 한번에 취소할 때만 전액 취소임)
    if (amount === cancelledPayment.amount) {
      return {
        ...params,
        type: 'Refund',
        hashData: hash(
          getHashDataString('Refund') +
            (cancelledPayment.payMethod === PayMethod.Vbank
              ? refundAcctNum
              : ''),
          'RSA-SHA512'
        ),
      } as IniapiRefundRequestParams;
    }

    const price = amount;
    const confirmPrice = cancelledPayment.remainAmount;

    return {
      ...params,
      type: 'PartialRefund',
      hashData: hash(
        getHashDataString('PartialRefund') +
          price.toString() +
          confirmPrice.toString() +
          (cancelledPayment.payMethod === PayMethod.Vbank ? refundAcctNum : ''),
        'RSA-SHA512'
      ),
      price,
      confirmPrice,
      currency: 'WON',
      tax: 0,
      taxFree,
    } as IniapiPartialRefundRequestParams;
  }

  public getGetTransactionParams(
    tid: string,
    oid: string
  ): IniapiGetTransactionRequestParams {
    const type = 'Extra';
    const paymethod = 'Inquiry';
    const { timestamp, clientIp, mid } = this.iniapiMap;

    const hashData = hash(
      INICIS_INIAPI_KEY + type + paymethod + timestamp + clientIp + mid,
      'RSA-SHA512'
    );

    return {
      type,
      paymethod,
      timestamp,
      clientIp,
      mid,
      originalTid: tid,
      oid,
      hashData,
    };
  }
}
