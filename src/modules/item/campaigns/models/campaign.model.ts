import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IItem } from '@item/items/interfaces';
import { Item } from '@item/items/models';

import { CampaignEntity } from '../entities';

dayjs.extend(utc);

@ObjectType()
export class Campaign extends CampaignEntity {
  @Field(() => [Item])
  @Type(() => Item)
  items: IItem[];

  @Field(() => Boolean, { description: '[MODEL ONLY]' })
  get isActive() {
    return dayjs().isAfter(this.startAt) && dayjs().isBefore(this.endAt);
  }
}
