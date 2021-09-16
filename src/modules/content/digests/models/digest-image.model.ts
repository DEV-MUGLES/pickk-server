import { Field, ObjectType } from '@nestjs/graphql';

import { DigestImageEntity } from '../entities';

import { Digest } from './digest.model';

@ObjectType()
export class DigestImage extends DigestImageEntity {
  @Field(() => Digest)
  digest: Digest;
}
