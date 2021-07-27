import { Field, ObjectType } from '@nestjs/graphql';
import { Pg, PaymentStatus, PayMethod } from '@pickk/pay';

import { Payment } from '../models';

@ObjectType()
export class PaymentsListPgCount {
  @Field()
  [Pg.Inicis]: number;
}

@ObjectType()
export class PaymentsListPayMethodCount {
  @Field()
  [PayMethod.Card]: number;

  @Field()
  [PayMethod.Vbank]: number;

  @Field()
  [PayMethod.Trans]: number;

  @Field()
  [PayMethod.Kakaopay]: number;
}

@ObjectType()
export class PaymentsListStatusCount {
  @Field()
  [PaymentStatus.Pending]: number;

  @Field()
  [PaymentStatus.VbankReady]: number;

  @Field()
  [PaymentStatus.Paid]: number;

  @Field()
  [PaymentStatus.Cancelled]: number;

  @Field()
  [PaymentStatus.PartialCancelled]: number;

  @Field()
  [PaymentStatus.Failed]: number;
}

@ObjectType()
export class PaymentsListAmount {
  @Field()
  totalPaidAmount: number;

  @Field()
  totalCancelledAmount: number;
}

@ObjectType()
export class PaymentListOutput {
  @Field(() => PaymentsListPgCount)
  pgCount: PaymentsListPgCount;

  @Field(() => PaymentsListPayMethodCount)
  payMethodCount: PaymentsListPayMethodCount;

  @Field(() => PaymentsListStatusCount)
  statusCount: PaymentsListStatusCount;

  @Field(() => PaymentsListAmount)
  amounts: PaymentsListAmount;

  @Field(() => [Payment])
  payments: Payment[];

  static of(payments: Payment[]): PaymentListOutput {
    const result = new PaymentListOutput();

    const pgCount = {
        [Pg.Inicis]: 0,
      },
      statusCount = {
        [PaymentStatus.Pending]: 0,
        [PaymentStatus.VbankReady]: 0,
        [PaymentStatus.Paid]: 0,
        [PaymentStatus.Failed]: 0,
        [PaymentStatus.Cancelled]: 0,
        [PaymentStatus.PartialCancelled]: 0,
      },
      payMethodCount = {
        [PayMethod.Card]: 0,
        [PayMethod.Vbank]: 0,
        [PayMethod.Trans]: 0,
        [PayMethod.Kakaopay]: 0,
      },
      amounts = {
        totalPaidAmount: 0,
        totalCancelledAmount: 0,
      };

    payments.forEach((payment) => {
      const { pg, status, payMethod, amount } = payment;

      pgCount[pg] ? (pgCount[pg] += 1) : (pgCount[pg] = 1);
      statusCount[status]
        ? (statusCount[status] += 1)
        : (statusCount[status] = 1);
      payMethodCount[payMethod]
        ? (payMethodCount[payMethod] += 1)
        : (payMethodCount[payMethod] = 1);

      const { Paid, Cancelled, PartialCancelled } = PaymentStatus;

      if ([Paid, Cancelled, PartialCancelled].includes(status)) {
        amounts.totalPaidAmount += amount;
      }

      if ([Cancelled, PartialCancelled].includes(status)) {
        amounts.totalCancelledAmount += amount;
      }
    });

    result.pgCount = pgCount;
    result.payMethodCount = payMethodCount;
    result.statusCount = statusCount;
    result.amounts = amounts;
    result.payments = payments;

    return result;
  }
}
