import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { ItemCategoryEntity } from '../entities';

@ObjectType()
export class ItemCategory extends ItemCategoryEntity {
  @Field(() => ItemCategory)
  @Type(() => ItemCategory)
  parent: ItemCategory;

  @Field(() => [ItemCategory])
  @Type(() => ItemCategory)
  children: ItemCategory[];
}
