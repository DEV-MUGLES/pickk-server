import { Field, ObjectType } from '@nestjs/graphql';

import { Digest } from '@content/digests/models';

import { VideoEntity } from '../entities';

@ObjectType()
export class Video extends VideoEntity {
  @Field(() => [Digest])
  digests: Digest[];
}
