import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';
import { User } from '@user/users/models';

import { VideoEntity } from '../entities';

@ObjectType()
export class Video extends VideoEntity {
  @Type(() => User)
  @Field(() => User, { nullable: true })
  user: User;

  @Type(() => Digest)
  @Field(() => [Digest])
  digests: Digest[];
}
