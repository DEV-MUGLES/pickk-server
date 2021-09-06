import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { Digest } from '../models';

import { CreateDigestImageInput } from './create-digest-image.input';

@InputType()
export class CreateDigestInput extends PickType(
  Digest,
  ['title', 'content', 'rating', 'size', 'itemId'],
  InputType
) {
  @Field(() => [Int])
  itemPropertyValueIds: number[];

  @Field(() => CreateDigestImageInput)
  imageInput: CreateDigestImageInput;

  userId: number;
}
