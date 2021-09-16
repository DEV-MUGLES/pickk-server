import { InputType, PickType } from '@nestjs/graphql';

import { PointEvent } from '../models';

@InputType()
export class CreateEventInput extends PickType(
  PointEvent,
  ['userId', 'title', 'content', 'amount', 'orderItemMerchantUid', 'type'],
  InputType
) {}
