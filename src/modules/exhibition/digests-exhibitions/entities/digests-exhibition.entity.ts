import { ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IDigestsExhibition, IDigestsExhibitionDigest } from '../interfaces';

@ObjectType()
@Entity({ name: 'digests_exhibition' })
export class DigestsExhibitionEntity
  extends BaseIdEntity
  implements IDigestsExhibition
{
  constructor(attributes?: Partial<DigestsExhibitionEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.exhibitionDigests = attributes.exhibitionDigests;
  }

  @OneToMany('DigestsExhibitionDigestEntity', 'exhibition', {
    cascade: true,
  })
  exhibitionDigests: IDigestsExhibitionDigest[];
}
