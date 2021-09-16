import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IDigest } from '@content/digests/interfaces';

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

    this.exhibition = attributes.exhibition;
    this.exhibitionId = attributes.exhibitionId;

    this.digest = attributes.digest;
    this.digestId = attributes.digestId;

    this.order = attributes.order;
  }

  @ManyToOne('DigestsExhibitionEntity', {
    onDelete: 'CASCADE',
  })
  exhibition: IDigestsExhibition;
  @Column()
  exhibitionId: number;

  @ManyToOne('DigestEntity', {
    onDelete: 'CASCADE',
  })
  digest: IDigest;
  @Column()
  digestId: number;

  @Column({ type: 'smallint', default: 0 })
  order: number;
}
