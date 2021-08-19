import { Field, ObjectType } from '@nestjs/graphql';

import { Digest } from '@content/digests/models';

import { LookEntity } from '../entities';

import { LookImage } from './look-image.model';

@ObjectType()
export class Look extends LookEntity {
  @Field(() => [LookImage])
  images: LookImage[];
  @Field(() => [Digest])
  digests: Digest[];
}
