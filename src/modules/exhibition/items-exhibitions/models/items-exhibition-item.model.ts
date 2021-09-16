import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Item } from '@item/items/models';

import { ItemsExhibitionItemEntity } from '../entities/items-exhibition-item.entity';

@ObjectType()
export class ItemsExhibitionItem extends ItemsExhibitionItemEntity {
  @Type(() => Item)
  @Field(() => Item)
  item: Item;
}
