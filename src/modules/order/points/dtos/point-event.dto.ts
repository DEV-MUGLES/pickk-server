import { InputType, PickType } from '@nestjs/graphql';
import { PointEvent } from '../models';

@InputType()
export class AddPointEventInput extends PickType(
  PointEvent,
  ['userId', 'title', 'content', 'amount'],
  InputType
) {}

@InputType()
export class SubstractPointEventInput extends PickType(
  PointEvent,
  ['userId', 'orderId', 'title', 'content', 'amount', 'orderItemId'],
  InputType
) {}
