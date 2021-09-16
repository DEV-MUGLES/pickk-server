import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';
import { StyleTag } from '@content/style-tags/models';
import { User } from '@user/users/models';

import { LookEntity } from '../entities';

import { LookImage } from './look-image.model';

@ObjectType()
export class Look extends LookEntity {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => [StyleTag])
  styleTags: StyleTag[];

  @Type(() => LookImage)
  @Field(() => [LookImage])
  images: LookImage[];
  @Type(() => Digest)
  @Field(() => [Digest])
  digests: Digest[];
}
