import { Field, ObjectType } from '@nestjs/graphql';

import { ItemPropertyEntity } from '../entities';

import { ItemPropertyValue } from './item-property-value.model';

@ObjectType()
export class ItemProperty extends ItemPropertyEntity {
  @Field(() => [ItemPropertyValue])
  values: ItemPropertyValue[];
}
