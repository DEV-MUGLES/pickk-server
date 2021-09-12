import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SetCategoryToItemInput {
  @Field(() => Int)
  majorCategoryId: number;

  @Field(() => Int)
  minorCategoryId: number;
}
