import { InputType, PickType } from '@nestjs/graphql';

import { ExpectedPointEvent } from '../models';

@InputType()
export class CreateExpectedPointEventInput extends PickType(
  ExpectedPointEvent,
  ['amount', 'title', 'orderItemMerchantUid', 'content', 'userId'],
  InputType
) {}
