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
    const canceledAmount = getRandomIntBetween(1000, 100000);
    const originAmount = canceledAmount + getRandomIntBetween(1000, 100000);
    const input: CancelPaymentInput = {
      amount: canceledAmount,
      reason: faker.lorem.text(),
      checksum: originAmount - canceledAmount,
    };

    it('성공적으로 부분 취소를 수행한다.', () => {
      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.Paid,
        amount: originAmount,
        cancellations: [],
      });

      payment.cancel(input);

      delete input.checksum;
      expect(payment.cancellations[0]).toMatchObject(input);
      expect(payment.cancelledAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.PartialCancelled);

      expect(payment.remainAmount).toEqual(originAmount - canceledAmount);
    });

    it('성공적으로 전액 취소를 수행한다', () => {
      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.Paid,
        amount: canceledAmount,
        cancellations: [],
      });
      input.checksum = 0;

      payment.cancel(input);

      delete input.checksum;

      expect(payment.cancellations.reverse()[0]).toMatchObject(input);
      expect(payment.cancelledAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.Cancelled);
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
        status: PaymentStatus.VbankReady,
      });

      payment.confirmVbankPaid();

      expect(payment.paidAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.Paid);
    });

    it('throw StatusInvalidToVbankPayException', () => {
      const payment = new Payment({
        status: getRandomEnumValue(PaymentStatus, [
          PaymentStatus.VbankReady,
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
        status: PaymentStatus.Pending,
      });

      payment.fail();

      expect(payment.failedAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.Failed);
    });

    it('throw StatusInvalidToFailException', () => {
      const payment = new Payment({
        status: getRandomEnumValue(PaymentStatus, [
          PaymentStatus.Pending,
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
        status: PaymentStatus.Pending,
        payMethod: getRandomEnumValue(PayMethod, [
          PayMethod.Vbank,
        ]) as PayMethod,
      });

      payment.complete(dto);

      expect(payment).toMatchObject(dto);
      expect(payment.paidAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.Paid);
    });

    it('성공적으로 수행한다. (가상계좌)', () => {
      const payment = new Payment({
        status: PaymentStatus.Pending,
        payMethod: PayMethod.Vbank,
      });

      payment.complete(dto);

      expect(payment).toMatchObject(dto);
      expect(payment.vbankReadyAt).toBeTruthy();
      expect(payment.paidAt).toBeFalsy();
      expect(payment.status).toEqual(PaymentStatus.VbankReady);
    });

    it('Pending 상태가 아닐 경우 StatusInvalidToCompleteException 발생', () => {
      const payment = new Payment({
        status: getRandomEnumValue(PaymentStatus, [
          PaymentStatus.Pending,
        ]) as PaymentStatus,
      });

      expect(() => payment.complete(dto)).toThrow(
        StatusInvalidToCompleteException
      );
    });
  });
});
