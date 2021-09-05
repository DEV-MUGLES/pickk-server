import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { Digest } from '@content/digests/models';

import { IDigestsExhibitionDigest, IDigestsExhibition } from '../interfaces';

@ObjectType()
@Entity({ name: 'digests_exhibition_digest' })
export class DigestsExhibitionDigestEntity
  extends BaseIdEntity
  implements IDigestsExhibitionDigest
{
  constructor(attributes?: Partial<DigestsExhibitionDigestEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
  }

  @ManyToOne('DigestsExhibitionEntity')
  exhibition: IDigestsExhibition;
  @Column({ type: 'int', nullable: true })
  exhibitionId: number;

  @Field(() => Digest)
  @ManyToOne('DigestEntity')
  digest: Digest;
  @Column({ type: 'int', nullable: true })
  digestId: number;

  @Field(() => Int)
  @Column({ type: 'smallint', default: 0 })
  order: number;
}
