import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import {
  PayMethod,
  PaymentCancellationType,
  PaymentStatus,
} from '../constants';
import { CancelPaymentInput, CompletePaymentDto } from '../dtos';
import {
  NotJoinedCancelException,
  StatusInvalidToCancelException,
  StatusInvalidToCompleteException,
  StatusInvalidToDodgeException,
  StatusInvalidToFailException,
  StatusInvalidToVbankPayException,
} from '../exceptions';

import { PaymentEntity } from '../entities/payment.entity';

import { PaymentCancellation } from './payment-cancellation.model';

@ObjectType()
export class Payment extends PaymentEntity {
  @Type(() => PaymentCancellation)
  @Field(() => [PaymentCancellation])
  cancellations: PaymentCancellation[];

  @Field(() => Int)
  get remainAmount(): number {
    return (
      this.amount -
      (this.cancellations ?? []).reduce((acc, { amount }) => acc + amount, 0)
    );
  }

  public dodgeVbank() {
    if (this.status !== PaymentStatus.VbankReady) {
      throw new StatusInvalidToDodgeException();
    }
    this.markVbankDodged();
  }

  public cancel(input: CancelPaymentInput): PaymentCancellation {
    if (this.cancellations == null) {
      throw new NotJoinedCancelException();
    }
    if (
      ![PaymentStatus.Paid, PaymentStatus.PartialCancelled].includes(
        this.status
      )
    ) {
      throw new StatusInvalidToCancelException(this.status);
    }

    const cancellation = PaymentCancellation.of(input, this);
    this.markCancelled(cancellation.type);

    return cancellation;
  }

  public confirmVbankPaid() {
    if (this.status !== PaymentStatus.VbankReady) {
      throw new StatusInvalidToVbankPayException(this.status);
    }
    this.markPaid();
  }

  public fail(): void {
    if (this.status !== PaymentStatus.Pending) {
      throw new StatusInvalidToFailException(this.status);
    }
    this.markFailed();
  }

  public complete(dto: CompletePaymentDto): void {
    if (this.status !== PaymentStatus.Pending) {
      throw new StatusInvalidToCompleteException(this.status);
    }

    Object.assign(this, dto);

    if (this.payMethod === PayMethod.Vbank) {
      this.markVbankReady();
    } else {
      this.markPaid();
    }
  }

  private markVbankDodged() {
    this.vbankDodgedAt = new Date();
    this.status = PaymentStatus.VbankDodged;
  }

  private markCancelled(type: PaymentCancellationType) {
    this.cancelledAt = new Date();
    this.status =
      type === PaymentCancellationType.Cancel
        ? PaymentStatus.Cancelled
        : PaymentStatus.PartialCancelled;
  }

  private markPaid() {
    this.paidAt = new Date();
    this.status = PaymentStatus.Paid;
  }

  private markFailed() {
    this.failedAt = new Date();
    this.status = PaymentStatus.Failed;
  }

  private markVbankReady() {
    this.vbankReadyAt = new Date();
    this.status = PaymentStatus.VbankReady;
  }
}
