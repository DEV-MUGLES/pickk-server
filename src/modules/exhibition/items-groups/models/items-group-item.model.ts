import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Item } from '@item/items/models';

import { ItemsGroupItemEntity } from '../entities';

import { ItemsGroup } from './items-group.model';

@ObjectType()
export class ItemsGroupItem extends ItemsGroupItemEntity {
  @Field(() => ItemsGroup)
  @Type(() => ItemsGroup)
  group: ItemsGroup;

  @Field(() => Item)
  @Type(() => Item)
  item: Item;
}
