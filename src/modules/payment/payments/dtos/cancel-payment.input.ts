import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

import { CancelOrderInput } from '@order/orders/dtos';
import { Order } from '@order/orders/models';

import { PaymentCancellation } from '../models';
import { PayMethod } from '../constants';

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
  @Field(() => Int)
  @IsNumber()
  checksum: number;

  constructor(attributes: CancelPaymentInput) {
    super(attributes);

    this.checksum = attributes.checksum;
  }

  static of(
    order: Order,
    cancelOrderInput: CancelOrderInput
  ): CancelPaymentInput {
    const result = new CancelPaymentInput({ ...cancelOrderInput });

    if (order.payMethod === PayMethod.Vbank) {
      result.refundVbankCode = order.vbankInfo.bankCode;
      result.refundVbankHolder = order.vbankInfo.ownerName;
      result.refundVbankNum = order.vbankInfo.number;
    }

    return result;
  }
}
