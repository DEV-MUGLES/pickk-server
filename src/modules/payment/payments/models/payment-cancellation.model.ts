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
    const { remainAmount, payMethod } = payment;
    const {
      amount,
      checksum = remainAmount - amount,
      refundVbankNum,
      refundVbankHolder,
      refundVbankCode,
    } = input;
    if (remainAmount < amount) {
      throw new NotEnoughRemainAmountException();
    }
    if (remainAmount !== amount + checksum) {
      throw new InconsistentChecksumException();
    }
    if (payMethod === PayMethod.Vbank) {
      if (!refundVbankCode || !refundVbankHolder || !refundVbankNum) {
        throw new VbankRefundInfoRequiredException();
      }
    }

    const type =
      input.amount === payment.amount
        ? PaymentCancellationType.Cancel
        : PaymentCancellationType.PartialCancel;

    return new PaymentCancellation({ ...input, type });
  }
}
