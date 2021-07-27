import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

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
  @Field(() => Int)
  @IsNumber()
  checksum: number;
}
