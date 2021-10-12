import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';

import { KeywordDigestEntity } from '../entities';

@ObjectType()
export class KeywordDigest extends KeywordDigestEntity {
  @Field(() => Digest)
  @Type(() => Digest)
  digest: Digest;
}
