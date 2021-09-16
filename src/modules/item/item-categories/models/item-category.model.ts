import { Field, ObjectType } from '@nestjs/graphql';

import { ItemCategoryEntity } from '../entities';

@ObjectType()
export class ItemCategory extends ItemCategoryEntity {
  @Field(() => ItemCategory)
  parent: ItemCategory;

  @Field(() => [ItemCategory])
  children: ItemCategory[];
}
