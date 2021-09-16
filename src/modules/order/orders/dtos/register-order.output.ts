import { ObjectType, OmitType } from '@nestjs/graphql';

import { Order } from '../models';

@ObjectType()
export class BaseOrderOutput extends OmitType(Order, [
  'vbankReceipt',
  'buyer',
  'receiver',
  'orderItems',
  'user',
]) {}
