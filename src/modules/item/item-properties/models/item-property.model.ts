import { Field, ObjectType } from '@nestjs/graphql';

import { ItemCategory } from '@item/item-categories/models';

import { ItemPropertyEntity } from '../entities';

import { ItemPropertyValue } from './item-property-value.model';

@ObjectType()
export class ItemProperty extends ItemPropertyEntity {
  @Field(() => ItemCategory)
  minorCategory: ItemCategory;

  @Field(() => [ItemPropertyValue])
  values: ItemPropertyValue[];
}
