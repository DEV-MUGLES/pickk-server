import { Field, ObjectType } from '@nestjs/graphql';

import { ItemOptionEntity } from '../entities';
import { ItemOptionValue } from './item-option-value.model';

@ObjectType()
export class ItemOption extends ItemOptionEntity {
  @Field(() => [ItemOptionValue])
  values: ItemOptionValue[];
}
