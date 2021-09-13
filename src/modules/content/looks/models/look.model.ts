import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';

import { LookEntity } from '../entities';

import { LookImage } from './look-image.model';

@ObjectType()
export class Look extends LookEntity {
  @Type(() => LookImage)
  @Field(() => [LookImage])
  images: LookImage[];
  @Type(() => Digest)
  @Field(() => [Digest])
  digests: Digest[];
}
