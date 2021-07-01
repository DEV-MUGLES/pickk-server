import { InputType, PickType } from '@nestjs/graphql';
import { PointEvent } from '../models';

@InputType()
export class CreateAddEventInput extends PickType(
  PointEvent,
  ['title', 'content', 'amount'],
  InputType
) {}

@InputType()
export class CreateSubstractEventInput extends PickType(
  PointEvent,
  ['userId', 'orderId', 'title', 'content', 'amount', 'orderItemId'],
  InputType
) {}
