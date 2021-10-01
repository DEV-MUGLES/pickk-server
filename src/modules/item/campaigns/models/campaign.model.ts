import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { IItem } from '@item/items/interfaces';
import { Item } from '@item/items/models';

import { CampaignEntity } from '../entities';

@ObjectType()
export class Campaign extends CampaignEntity {
  @Field(() => [Item])
  @Type(() => Item)
  items: IItem[];
}
