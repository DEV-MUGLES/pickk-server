import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractImageEntity } from '@common/entities';

import { IDigest, IDigestImage } from '../interfaces';

@ObjectType()
@Entity({ name: 'digest_image' })
export class DigestImageEntity
  extends AbstractImageEntity
  implements IDigestImage
{
  constructor(attributes?: Partial<DigestImageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.digest = attributes.digest;
    this.digestId = attributes.digestId;

    this.order = attributes.order;
  }

  @ManyToOne('DigestEntity', 'images', { onDelete: 'CASCADE' })
  digest: IDigest;
  @Field(() => Int)
  @Column()
  digestId: number;

  @Field()
  @Column({ type: 'tinyint', default: 0, unsigned: true })
  order: number;
}
