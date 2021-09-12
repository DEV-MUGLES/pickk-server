import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ManualCreateItemInput {
  @Field()
  brandNameKor: string;

  @Field()
  name: string;
  @Field()
  imageUrl: string;
  @Field(() => Int)
  originalPrice: number;
  @Field(() => Int)
  sellPrice: number;

  @Field(() => Int)
  majorCategoryId: number;
  @Field(() => Int)
  minorCategoryId: number;

  @Field()
  url: string;
}
