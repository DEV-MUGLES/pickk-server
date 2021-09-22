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
    if (this.status !== PaymentStatus.VBANK_READY) {
      throw new StatusInvalidToDodgeException();
    }
    this.markVbankDodged();
  }

  public cancel(input: CancelPaymentInput): PaymentCancellation {
    if (this.cancellations == null) {
      throw new NotJoinedCancelException();
    }
    if (
      ![PaymentStatus.PAID, PaymentStatus.PARTIAL_CANCELLED].includes(
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
    if (this.status !== PaymentStatus.VBANK_READY) {
      throw new StatusInvalidToVbankPayException(this.status);
    }
    this.markPaid();
  }

  public fail(): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new StatusInvalidToFailException(this.status);
    }
    this.markFailed();
  }

  public complete(dto: CompletePaymentDto): void {
    if (this.status !== PaymentStatus.PENDING) {
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
    this.status = PaymentStatus.VBANK_DODGED;
  }

  private markCancelled(type: PaymentCancellationType) {
    this.cancelledAt = new Date();
    this.status =
      type === PaymentCancellationType.CANCEL
        ? PaymentStatus.CANCELLED
        : PaymentStatus.PARTIAL_CANCELLED;
  }

  private markPaid() {
    this.paidAt = new Date();
    this.status = PaymentStatus.PAID;
  }

  private markFailed() {
    this.failedAt = new Date();
    this.status = PaymentStatus.FAILED;
  }

  private markVbankReady() {
    this.vbankReadyAt = new Date();
    this.status = PaymentStatus.VBANK_READY;
  }
}
