import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity as _TypeORMBaseEntity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { S3 } from 'aws-sdk';

import { IImage } from '../interfaces';

@ObjectType()
export abstract class AbstractImageEntity
  extends _TypeORMBaseEntity
  implements IImage
{
  constructor(attributes?: Partial<AbstractImageEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.createdAt = attributes.createdAt;

    this.key = attributes.key;
    this.angle = attributes.angle;
  }

  @Field()
  @PrimaryColumn({
    type: 'varchar',
    length: 75,
  })
  key: string;

  @Field(() => Int)
  @Column({ default: 0 })
  angle: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  get url(): string {
    return process.env.AWS_CLOUDFRONT_URL + this.key;
  }

  async remove() {
    const s3 = new S3();
    const params: S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      Key: this.key,
    };
    s3.deleteObject(params)
      .promise()
      .catch(() => null);
    return await super.remove();
  }
}
