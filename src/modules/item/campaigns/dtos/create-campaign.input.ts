import { InputType, PickType } from '@nestjs/graphql';

import { Campaign } from '../models';

@InputType()
export class CreateCampaignInput extends PickType(
  Campaign,
  ['title', 'rate', 'startAt', 'endAt'],
  InputType
) {}
