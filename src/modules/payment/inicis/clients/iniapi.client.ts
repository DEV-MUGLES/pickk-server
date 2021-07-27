import dayjs from 'dayjs';
import {
  IniapiRefundRequestParams,
  IniapiPartialRefundRequestParams,
  IniapiVacctRefundRequestParams,
  hash,
  IniapiCommonRequestParams,
  IniapiGetTransactionRequestParams,
} from 'inicis';

import { INICIS_INIAPI_KEY, INICIS_MID } from '../constants';
import { InicisCancelDto } from '../dtos';
import { toIniapiPayMethod } from '../serializers';

export class IniapiClient {
  private getIniapiMap(): IniapiCommonRequestParams {
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const clientIp = '127.0.0.1';
    const mid = INICIS_MID;

    return { timestamp, clientIp, mid };
  }

  public getCancelParams(
    cancelDto: InicisCancelDto
  ):
    | IniapiRefundRequestParams
    | IniapiPartialRefundRequestParams
    | IniapiVacctRefundRequestParams {
    const { payment, amount, reason, taxFree = 0 } = cancelDto;

    const { timestamp, clientIp, mid } = this.getIniapiMap();
    const paymethod = toIniapiPayMethod(payment.payMethod);
    const tid = payment.pgTid;
    const msg = reason;

    const getHashDataString = (type: string) =>
      INICIS_INIAPI_KEY + type + paymethod + timestamp + clientIp + mid + tid;

    const params: Omit<IniapiRefundRequestParams, 'type' | 'hashData'> = {
      paymethod,
      timestamp,
      mid,
      tid,
      msg,
      clientIp: '127.0.0.1',
    };

    // 전액 취소인 경우
    if (amount !== payment.amount) {
      return {
        ...params,
        type: 'Refund',
        hashData: hash(getHashDataString('Refund'), 'RSA-SHA512'),
      } as IniapiRefundRequestParams;
    }

    const price = amount;
    const confirmPrice = payment.remainAmount - amount;

    return {
      ...params,
      type: 'PartialRefund',
      hashData: hash(
        getHashDataString('Refund') +
          price.toString() +
          confirmPrice.toString(),
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
    const { timestamp, clientIp, mid } = this.getIniapiMap();

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
