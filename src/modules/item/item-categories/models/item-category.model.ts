import { Field, ObjectType } from '@nestjs/graphql';

import { ItemCategoryEntity } from '../entities';

@ObjectType()
export class ItemCategory extends ItemCategoryEntity {
  @Field(() => [ItemCategory])
  children: ItemCategory[];

  @Field(() => ItemCategory)
  parent: ItemCategory;
}
