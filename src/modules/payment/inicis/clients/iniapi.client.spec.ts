import { IniapiPartialRefundRequestParams } from 'inicis';
import * as faker from 'faker';

import { getRandomIntBetween } from '@common/helpers';

import { PayMethod } from '@payment/payments/constants';
import { Payment, PaymentCancellation } from '@payment/payments/models';

import { InicisCancelDto } from '../dtos';

import { IniapiClient } from './iniapi.client';

describe('IniapiClient', () => {
  describe('getCancelParams', () => {
    it('[전액취소] 성공', () => {
      const amount = getRandomIntBetween(30000, 50000);
      const canceledAmount = amount;

      const cancelledPayment = new Payment({
        payMethod: PayMethod.Card,
        pgTid: faker.lorem.word(),
        amount,
        cancellations: [
          new PaymentCancellation({
            amount: canceledAmount,
          }),
        ],
      });
      const dto: InicisCancelDto = {
        amount: canceledAmount,
        reason: faker.lorem.text(),
        cancelledPayment,
      };

      const result = new IniapiClient().getCancelParams(dto);

      expect(result.type).toEqual('Refund');
      expect(result.msg).toEqual(dto.reason);
    });

    it('[부분취소] 성공', () => {
      const amount = getRandomIntBetween(30000, 50000);
      const canceledAmount = getRandomIntBetween(10000, 20000);

      const cancelledPayment = new Payment({
        payMethod: PayMethod.Card,
        pgTid: faker.lorem.word(),
        amount,
        cancellations: [
          new PaymentCancellation({
            amount: canceledAmount,
          }),
        ],
      });
      const dto: InicisCancelDto = {
        amount: canceledAmount,
        reason: faker.lorem.text(),
        cancelledPayment,
      };

      const result = new IniapiClient().getCancelParams(
        dto
      ) as IniapiPartialRefundRequestParams;

      expect(result.type).toEqual('PartialRefund');
      expect(result.msg).toEqual(dto.reason);
      expect(result.price).toEqual(canceledAmount);
      expect(result.confirmPrice).toEqual(amount - canceledAmount);
      expect(result.confirmPrice).toEqual(cancelledPayment.remainAmount);
    });
  });
});
