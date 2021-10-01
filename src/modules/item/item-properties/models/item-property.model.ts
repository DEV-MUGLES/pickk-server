import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { ItemCategory } from '@item/item-categories/models';

import { ItemPropertyEntity } from '../entities';

import { ItemPropertyValue } from './item-property-value.model';

@ObjectType()
export class ItemProperty extends ItemPropertyEntity {
  @Field(() => ItemCategory)
  @Type(() => ItemCategory)
  minorCategory: ItemCategory;

  @Field(() => [ItemPropertyValue])
  @Type(() => ItemPropertyValue)
  values: ItemPropertyValue[];
}
