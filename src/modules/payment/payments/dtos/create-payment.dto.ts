import { PickType } from '@nestjs/mapped-types';

import { PaymentEntity } from '../entities';

export class CreatePaymentDto extends PickType(PaymentEntity, [
  'merchantUid',
  'env',
  'origin',
  'pg',
  'payMethod',
  'name',
  'amount',
  'buyerName',
  'buyerTel',
  'buyerEmail',
  'buyerAddr',
  'buyerPostalcode',
]) {
  constructor(attributes: CreatePaymentDto) {
    super();
    Object.assign(this, attributes);
  }
}
