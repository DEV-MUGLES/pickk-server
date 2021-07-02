import { IItem } from '@item/items/interfaces/item.interface';
import { Item } from '@item/items/models/item.model';
import { Field, ObjectType } from '@nestjs/graphql';

import { CampaignEntity } from '../entities/campaign.entity';

@ObjectType()
export class Campaign extends CampaignEntity {
  @Field(() => [Item])
  items: IItem[];
}
