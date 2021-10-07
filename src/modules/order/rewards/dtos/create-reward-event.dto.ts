import { InputType, PickType } from '@nestjs/graphql';

import { RewardEvent } from '../models';

@InputType()
export class CreateRewardEventInput extends PickType(
  RewardEvent,
  [
    'title',
    'sign',
    'amount',
    'userId',
    'recommendDigestId',
    'orderItemMerchantUid',
  ],
  InputType
) {}
