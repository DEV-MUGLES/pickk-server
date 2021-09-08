import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { Digest } from '../models';

@InputType()
export class CreateDigestInput extends PickType(
  Digest,
  ['title', 'content', 'rating', 'size', 'itemId'],
  InputType
) {
  @Field(() => [Int])
  itemPropertyValueIds: number[];

  @Field(() => [String])
  imageUrls: string[];
}
