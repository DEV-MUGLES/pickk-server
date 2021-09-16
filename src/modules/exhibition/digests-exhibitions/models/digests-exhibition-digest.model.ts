import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';

import { DigestsExhibitionDigestEntity } from '../entities/digests-exhibition-digest.entity';

@ObjectType()
export class DigestsExhibitionDigest extends DigestsExhibitionDigestEntity {
  @Type(() => Digest)
  @Field(() => Digest)
  digest: Digest;
}
