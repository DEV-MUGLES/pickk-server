import { ObjectType, OmitType } from '@nestjs/graphql';

import { Order } from '../models';

@ObjectType()
export class RegisterOrderOutput extends OmitType(Order, [
  'vbankInfo',
  'buyer',
  'receiver',
  'orderItems',
  'user',
]) {}
