import { PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PaymentEntity } from '../entities';

export class CompletePaymentDto extends PartialType(
  PickType(PaymentEntity, [
    'applyNum',
    'cardCode',
    'cardNum',
    'vbankCode',
    'vbankHolder',
    'vbankNum',
    'vbankDate',
  ])
) {
  @IsString()
  pgTid: string;
}
