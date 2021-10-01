import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { ItemOptionEntity } from '../entities';
import { ItemOptionValue } from './item-option-value.model';

@ObjectType()
export class ItemOption extends ItemOptionEntity {
  @Field(() => [ItemOptionValue])
  @Type(() => ItemOptionValue)
  values: ItemOptionValue[];
}
