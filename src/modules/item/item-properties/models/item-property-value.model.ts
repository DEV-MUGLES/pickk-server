import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { ItemPropertyValueEntity } from '../entities';
import { ItemProperty } from './item-property.model';

@ObjectType()
export class ItemPropertyValue extends ItemPropertyValueEntity {
  @Field(() => ItemProperty)
  @Type(() => ItemProperty)
  property: ItemProperty;
}
