import { InputType, Field, PickType } from '@nestjs/graphql';

import { ItemOption } from '../models';

import { CreateItemOpionValueInput } from './item-option-value.input';

@InputType()
export class CreateItemOptionInput {
  @Field(() => String)
  name: string;

  @Field(() => [CreateItemOpionValueInput])
  values: CreateItemOpionValueInput[];
}

@InputType()
export class CreateItemOptionSetInput {
  @Field(() => [CreateItemOptionInput])
  options: CreateItemOptionInput[];
}

@InputType()
export class UpdateItemOptionInput extends PickType(
  ItemOption,
  ['name'],
  InputType
) {}
