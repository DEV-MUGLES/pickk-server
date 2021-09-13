import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { Look } from '../models';

@InputType()
export class CreateLookDigestInput {
  @Field(() => Int)
  itemId: number;

  @Field()
  size: string;
}

@InputType()
export class CreateLookInput extends PickType(Look, ['title'], InputType) {
  @Field(() => [Int])
  styleTagIds: number[];

  @Field(() => [String])
  imageUrls: string[];

  @Field(() => [CreateLookDigestInput])
  digests: CreateLookDigestInput[];
}
