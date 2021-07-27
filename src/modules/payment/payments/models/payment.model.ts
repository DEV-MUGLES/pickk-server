import { Field, ObjectType } from '@nestjs/graphql';

import {
  PayMethod,
  PaymentCancellationType,
  PaymentStatus,
} from '../constants';
import { CancelPaymentInput, CompletePaymentDto } from '../dtos';

import { PaymentEntity } from '../entities/payment.entity';
import {
  NotJoinedCancelException,
  StatusInvalidToCancelException,
  StatusInvalidToCompleteException,
  StatusInvalidToFailException,
  StatusInvalidToVbankPayException,
} from '../exceptions';

import { PaymentCancellation } from './payment-cancellation.model';

@ObjectType()
export class Payment extends PaymentEntity {
  @Field(() => [PaymentCancellation])
  cancellations: PaymentCancellation[];

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
