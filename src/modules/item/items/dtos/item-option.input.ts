import { InputType, Field } from '@nestjs/graphql';

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
