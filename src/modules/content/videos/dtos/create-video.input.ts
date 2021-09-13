import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { Digest } from '@content/digests/models';

import { Video } from '../models';

@InputType()
export class CreateVideoDigestInput extends PickType(
  Digest,
  [
    'itemId',
    'timestampStartSecond',
    'timestampEndSecond',
    'size',
    'rating',
    'title',
  ],
  InputType
) {
  @Field(() => [Int], { nullable: true })
  itemPropertyValueIds: number[];
}

@InputType()
export class CreateVideoInput extends PickType(
  Video,
  ['youtubeCode', 'title'],
  InputType
) {
  @Field(() => [CreateVideoDigestInput])
  digests: CreateVideoDigestInput[];
}
