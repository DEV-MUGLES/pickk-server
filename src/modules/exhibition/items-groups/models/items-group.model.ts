import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Item } from '@item/items/models';

import { ItemsGroupEntity } from '../entities';

import { ItemsGroupItem } from './items-group-item.model';

@ObjectType()
export class ItemsGroup extends ItemsGroupEntity {
  @Field(() => [ItemsGroupItem])
  @Type(() => ItemsGroupItem)
  groupItems: ItemsGroupItem[];

  @Field(() => [Item])
  @Type(() => Item)
  get items(): Item[] {
    if (!this.groupItems) {
      return [];
    }

    return this.groupItems.sort((a, b) => a.order - b.order).map((v) => v.item);
  }
}
