import { Field, ObjectType } from '@nestjs/graphql';

import { Digest } from '@content/digests/models';

import { DigestsExhibitionEntity } from '../entities';

import { DigestsExhibitionDigest } from './digests-exhibition-digest.model';

@ObjectType()
export class DigestsExhibition extends DigestsExhibitionEntity {
  exhibitionDigests: DigestsExhibitionDigest[];

  @Field(() => [Digest])
  get digests(): Digest[] {
    if (!this.exhibitionDigests) {
      return [];
    }

    return this.exhibitionDigests
      .sort((a, b) => a.order - b.order)
      .map((v) => v.digest);
  }
}
