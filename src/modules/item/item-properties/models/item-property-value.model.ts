import { Field, ObjectType } from '@nestjs/graphql';

import { ItemPropertyValueEntity } from '../entities';
import { ItemProperty } from './item-property.model';

@ObjectType()
export class ItemPropertyValue extends ItemPropertyValueEntity {
  @Field(() => ItemProperty)
  property: ItemProperty;
}
