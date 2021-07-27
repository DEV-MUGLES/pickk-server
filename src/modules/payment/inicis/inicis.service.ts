import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IniapiGetTransactionResult, IniapiRefundResult } from 'inicis';
import * as qs from 'querystring';

import { Payment } from '@payment/payments/models';

import { IniapiClient } from './clients';
import { INIAPI_CANCEL_URL, INIAPI_EXTRA_URL } from './constants';
import {
  InicisCancelDto,
  InicisMobVbankNotiDto,
  InicisStdVbankNotiDto,
} from './dtos';
import {
  InicisCancelFailedException,
  InicisGetTransactionFailedException,
} from './exceptions';

@Injectable()
export class InicisService {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  async cancel(dto: InicisCancelDto) {
    const params = new IniapiClient().getCancelParams(dto);

    const { data: result } = await firstValueFrom(
      this.httpService.post<IniapiRefundResult>(
        INIAPI_CANCEL_URL,
        qs.stringify(params),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            charset: 'utf-8',
          },
        }
      )
    );

    const { resultCode, resultMsg } = result;
    if (resultCode !== '00') {
      throw new InicisCancelFailedException(resultMsg);
    }
  }

  private async getTransaction(
    tid: string,
    oid: string
  ): Promise<IniapiGetTransactionResult> {
    const params = new IniapiClient().getGetTransactionParams(tid, oid);

    const { data: result } = await firstValueFrom(
      this.httpService.post<IniapiGetTransactionResult>(
        INIAPI_EXTRA_URL,
        qs.stringify(params),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            charset: 'utf-8',
          },
        }
      )
    );

    const { resultCode, resultMsg, status } = result;
    if (resultCode === '01') {
      throw new NotFoundException('KG이니시스: 거래를 찾을 수 없습니다.');
    }
    if (resultCode !== '00') {
      throw new InicisGetTransactionFailedException(resultMsg);
    }
    if (status === '9') {
      throw new NotFoundException('KG이니시스: 거래를 찾을 수 없습니다.');
    }

    return result;
  }

  async validateStdVbankNoti(
    dto: InicisStdVbankNotiDto,
    payment: Payment
  ): Promise<boolean> {
    if (!payment) {
      throw new NotFoundException(
        '[KG이니시스 가상계좌 입금통보] 해당 입금건에 대한 결제정보가 존재하지 않습니다.'
      );
    }

    const transaction = await this.getTransaction(
      payment.pgTid,
      payment.merchantUid
    );
    return InicisStdVbankNotiDto.validate(dto, payment, transaction);
  }

  async validateMobVbankNoti(
    dto: InicisMobVbankNotiDto,
    payment: Payment
  ): Promise<boolean> {
    if (!payment) {
      throw new NotFoundException(
        '[KG이니시스 가상계좌 입금통보] 해당 입금건에 대한 결제정보가 존재하지 않습니다.'
      );
    }

    const transaction = await this.getTransaction(
      payment.pgTid,
      payment.merchantUid
    );
    return InicisMobVbankNotiDto.validate(dto, payment, transaction);
  }
}
