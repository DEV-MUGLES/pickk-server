import * as faker from 'faker';

import { getRandomEnumValue, getRandomIntBetween } from '@common/helpers';

import { PaymentStatus, PayMethod } from '../constants';
import { CancelPaymentInput, CompletePaymentDto } from '../dtos';
import {
  NotJoinedCancelException,
  StatusInvalidToCancelException,
  StatusInvalidToVbankPayException,
  StatusInvalidToFailException,
  StatusInvalidToCompleteException,
} from '../exceptions';

import { Payment } from './payment.model';

describe('Payment', () => {
  describe('cancel', () => {
    const amount = getRandomIntBetween(1000, 100000);
    const input: CancelPaymentInput = {
      amount,
      reason: faker.lorem.text(),
      checksum: amount,
    };

    it('성공적으로 수행한다.', () => {
      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.PAID,
        amount,
        cancellations: [],
      });

      const result = payment.cancel(input);

      delete input.checksum;
      expect(result).toMatchObject(input);
      expect(payment.cancelledAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.CANCELLED);
    });

    it('throw NotJoinedCancelException', () => {
      const payment = new Payment();
      expect(() => payment.cancel(input)).toThrow(NotJoinedCancelException);
    });

    it('throw StatusInvalidToCancelException', () => {
      const payment = new Payment({
        cancellations: [],
      });
      expect(() => payment.cancel(input)).toThrow(
        StatusInvalidToCancelException
      );
    });
  });

  describe('confirmVbankPaid', () => {
    it('성공적으로 수행한다.', () => {
      const payment = new Payment({
        status: PaymentStatus.VBANK_READY,
      });

      payment.confirmVbankPaid();

      expect(payment.paidAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.PAID);
    });

    it('throw StatusInvalidToVbankPayException', () => {
      const payment = new Payment({
        status: getRandomEnumValue(PaymentStatus, [
          PaymentStatus.VBANK_READY,
        ]) as PaymentStatus,
      });

      expect(() => payment.confirmVbankPaid()).toThrow(
        StatusInvalidToVbankPayException
      );
    });
  });

  describe('fail', () => {
    it('성공적으로 수행한다.', () => {
      const payment = new Payment({
        status: PaymentStatus.PENDING,
      });

      payment.fail();

      expect(payment.failedAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.FAILED);
    });

    it('throw StatusInvalidToFailException', () => {
      const payment = new Payment({
        status: getRandomEnumValue(PaymentStatus, [
          PaymentStatus.PENDING,
        ]) as PaymentStatus,
      });

      expect(() => payment.fail()).toThrow(StatusInvalidToFailException);
    });
  });

  describe('complete', () => {
    const dto: CompletePaymentDto = {
      pgTid: faker.lorem.text(),
    };

    it('성공적으로 수행한다. (not 가상계좌)', () => {
      const payment = new Payment({
        status: PaymentStatus.PENDING,
        payMethod: getRandomEnumValue(PayMethod, [
          PayMethod.Vbank,
        ]) as PayMethod,
      });

      payment.complete(dto);

      expect(payment).toMatchObject(dto);
      expect(payment.paidAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.PAID);
    });

    it('성공적으로 수행한다. (가상계좌)', () => {
      const payment = new Payment({
        status: PaymentStatus.PENDING,
        payMethod: PayMethod.Vbank,
      });

      payment.complete(dto);

      expect(payment).toMatchObject(dto);
      expect(payment.vbankReadyAt).toBeTruthy();
      expect(payment.paidAt).toBeFalsy();
      expect(payment.status).toEqual(PaymentStatus.VBANK_READY);
    });

    it('Pending 상태가 아닐 경우 StatusInvalidToCompleteException 발생', () => {
      const payment = new Payment({
        status: getRandomEnumValue(PaymentStatus, [
          PaymentStatus.PENDING,
        ]) as PaymentStatus,
      });

      expect(() => payment.complete(dto)).toThrow(
        StatusInvalidToCompleteException
      );
    });
  });
});
