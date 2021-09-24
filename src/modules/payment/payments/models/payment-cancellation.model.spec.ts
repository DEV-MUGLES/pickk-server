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
    const canceledAmount = getRandomIntBetween(1000, 100000);
    const remainAmount = canceledAmount + getRandomIntBetween(1000, 100000);

    const input: CancelPaymentInput = {
      amount: canceledAmount,
      reason: faker.lorem.text(),
      checksum: remainAmount - canceledAmount,
    };

    it('성공!', () => {
      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.Paid,
        amount: remainAmount,
        cancellations: [],
      });

      expect(PaymentCancellation.of(input, payment)).toMatchObject({
        amount: input.amount,
        reason: input.reason,
      });
    });

    it('throw NotEnoughRemainAmountException', () => {
      const payment = new Payment({
        amount: canceledAmount - 100,
        status: PaymentStatus.Paid,
        cancellations: [],
      });
      expect(() => PaymentCancellation.of(input, payment)).toThrow(
        NotEnoughRemainAmountException
      );
    });

    it('throw InconsistentChecksumException', () => {
      const payment = new Payment({
        amount: remainAmount,
        status: PaymentStatus.Paid,
        cancellations: [],
      });
      expect(() =>
        PaymentCancellation.of(
          { ...input, checksum: remainAmount - canceledAmount - 10 },
          payment
        )
      ).toThrow(InconsistentChecksumException);
    });

    it('throw VbankRefundInfoRequiredException', () => {
      const payment = new Payment({
        amount: remainAmount,
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
