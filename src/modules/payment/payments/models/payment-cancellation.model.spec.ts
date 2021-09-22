import * as faker from 'faker';

import { getRandomIntBetween } from '@common/helpers';

import { PaymentStatus, PayMethod } from '../constants';
import {
  InconsistentChecksumException,
  NotEnoughRemainAmountException,
  VbankRefundInfoRequiredException,
} from '../exceptions';
import { CancelPaymentInput } from '../dtos';

import { Payment } from './payment.model';
import { PaymentCancellation } from './payment-cancellation.model';

describe('PaymentCancellation', () => {
  describe('of', () => {
    const amount = getRandomIntBetween(1000, 100000);
    const input: CancelPaymentInput = {
      amount,
      reason: faker.lorem.text(),
      checksum: amount,
    };

    it('성공!', () => {
      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.Paid,
        amount,
        cancellations: [],
      });

      expect(PaymentCancellation.of(input, payment)).toMatchObject({
        amount: input.amount,
        reason: input.reason,
      });
    });

    it('throw NotEnoughRemainAmountException', () => {
      const payment = new Payment({
        amount: amount - 100,
        status: PaymentStatus.Paid,
        cancellations: [],
      });
      expect(() => PaymentCancellation.of(input, payment)).toThrow(
        NotEnoughRemainAmountException
      );
    });

    it('throw InconsistentChecksumException', () => {
      const payment = new Payment({
        amount,
        status: PaymentStatus.Paid,
        cancellations: [],
      });
      expect(() =>
        PaymentCancellation.of({ ...input, checksum: amount - 10 }, payment)
      ).toThrow(InconsistentChecksumException);
    });

    it('throw VbankRefundInfoRequiredException', () => {
      const payment = new Payment({
        amount,
        status: PaymentStatus.Paid,
        payMethod: PayMethod.Vbank,
        cancellations: [],
      });
      expect(() => PaymentCancellation.of(input, payment)).toThrow(
        VbankRefundInfoRequiredException
      );
    });
  });
});
