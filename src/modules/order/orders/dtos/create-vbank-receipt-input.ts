import { InputType, PickType } from '@nestjs/graphql';

import { OrderVbankReceipt } from '../models';

@InputType()
export class CreateOrderVbankReceiptInput extends PickType(
  OrderVbankReceipt,
  ['bankCode', 'number', 'ownerName', 'due'],
  InputType
) {}
