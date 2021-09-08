import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

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
    this.order = attributes.order;
    this.digest = attributes.digest;
  }

  @Field()
  @Column({ type: 'tinyint', default: 0, unsigned: true })
  order: number;

  @ManyToOne('DigestEntity', 'images', {
    onDelete: 'CASCADE',
  })
  digest: DigestEntity;
}
