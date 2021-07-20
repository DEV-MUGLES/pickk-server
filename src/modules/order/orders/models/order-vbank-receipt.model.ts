import { ObjectType } from '@nestjs/graphql';

import { OrderVbankReceiptEntity } from '../entities';

@ObjectType()
export class OrderVbankReceipt extends OrderVbankReceiptEntity {}
