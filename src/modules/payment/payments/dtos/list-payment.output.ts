import { Field, ObjectType } from '@nestjs/graphql';

import { Pg, PaymentStatus, PayMethod } from '../constants';
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
  [PaymentStatus.PENDING]: number;

  @Field()
  [PaymentStatus.VBANK_READY]: number;

  @Field()
  [PaymentStatus.PAID]: number;

  @Field()
  [PaymentStatus.CANCELLED]: number;

  @Field()
  [PaymentStatus.PARTIAL_CANCELLED]: number;

  @Field()
  [PaymentStatus.FAILED]: number;
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
        [PaymentStatus.PENDING]: 0,
        [PaymentStatus.VBANK_READY]: 0,
        [PaymentStatus.PAID]: 0,
        [PaymentStatus.FAILED]: 0,
        [PaymentStatus.CANCELLED]: 0,
        [PaymentStatus.PARTIAL_CANCELLED]: 0,
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

      const { PAID, CANCELLED, PARTIAL_CANCELLED } = PaymentStatus;

      if ([PAID, CANCELLED, PARTIAL_CANCELLED].includes(status)) {
        amounts.totalPaidAmount += amount;
      }

      if ([CANCELLED, PARTIAL_CANCELLED].includes(status)) {
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
