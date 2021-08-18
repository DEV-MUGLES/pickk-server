import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';

import { AbstractImageEntity } from '@common/entities';

import { DigestEntity } from './digest.entity';

@ObjectType()
@Entity({ name: 'digest_image' })
export class DigestImageEntity extends AbstractImageEntity {
  constructor(attributes?: Partial<DigestImageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.digest = attributes.digest;
  }

  @ManyToOne('DigestEntity', 'images', {
    onDelete: 'CASCADE',
  })
  digest: DigestEntity;
}
