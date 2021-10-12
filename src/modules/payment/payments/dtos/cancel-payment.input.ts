import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

import { Order } from '@order/orders/models';

import { PayMethod } from '../constants';
import { PaymentCancellation } from '../models';

@InputType()
export class CancelPaymentInput extends PickType(
  PaymentCancellation,
  [
    'amount',
    'reason',
    'refundVbankCode',
    'refundVbankHolder',
    'refundVbankNum',
  ] as const,
  InputType
) {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  checksum?: number;

  constructor(attributes: CancelPaymentInput) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.reason = attributes.reason;
    this.amount = attributes.amount;
    this.checksum = attributes.checksum;
  }

  static of(
    order: Order,
    reason: string,
    amount: number,
    checksum?: number
  ): CancelPaymentInput {
    const result = new CancelPaymentInput({ reason, amount, checksum });

    if (order.payMethod === PayMethod.Vbank) {
      result.refundVbankCode = order.refundAccount.bankCode;
      result.refundVbankHolder = order.refundAccount.ownerName;
      result.refundVbankNum = order.refundAccount.number;
    }

    return result;
  }
}
