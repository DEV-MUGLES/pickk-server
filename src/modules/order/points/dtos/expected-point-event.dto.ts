import { InputType, PickType } from '@nestjs/graphql';

import { ExpectedPointEvent } from '../models';

@InputType()
export class CreateExpectedPointEventInput extends PickType(
  ExpectedPointEvent,
  ['amount', 'title', 'orderId', 'content', 'userId'],
  InputType
) {}

export class RemoveExpectedPointEventDto {
  orderId: number;
}
