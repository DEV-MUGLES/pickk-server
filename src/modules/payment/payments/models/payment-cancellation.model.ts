import { Field, ObjectType } from '@nestjs/graphql';

import { PaymentCancellationType, PayMethod } from '../constants';
import { CancelPaymentInput } from '../dtos';
import { PaymentCancellationEntity } from '../entities';
import {
  NotEnoughRemainAmountException,
  InconsistentChecksumException,
  VbankRefundInfoRequiredException,
} from '../exceptions';

import { Payment } from './payment.model';

@ObjectType()
export class PaymentCancellation extends PaymentCancellationEntity {
  @Field(() => Payment)
  payment: Payment;

  static of(input: CancelPaymentInput, payment: Payment): PaymentCancellation {
    const {
      amount,
      checksum,
      refundVbankNum,
      refundVbankHolder,
      refundVbankCode,
    } = input;

    const remainAmount =
      payment.amount -
      (payment.cancellations ?? []).reduce(
        (acc, { amount }) => acc + amount,
        0
      );
    if (amount > remainAmount) {
      throw new NotEnoughRemainAmountException();
    }
    if (remainAmount !== checksum) {
      throw new InconsistentChecksumException();
    }
    if (payment.payMethod === PayMethod.Vbank) {
      if (!refundVbankCode || !refundVbankHolder || !refundVbankNum) {
        throw new VbankRefundInfoRequiredException();
      }
    }

    const type =
      input.amount === payment.amount
        ? PaymentCancellationType.Cancel
        : PaymentCancellationType.PatialCancel;

    return new PaymentCancellation({ ...input, type });
  }
}
