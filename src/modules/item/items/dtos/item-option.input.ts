import { InputType, Field, PickType } from '@nestjs/graphql';

import { ItemOption } from '../models';

@InputType()
export class CreateItemOptionInput {
  @Field(() => String)
  name: string;

  @Field(() => [String])
  values: string[];
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
