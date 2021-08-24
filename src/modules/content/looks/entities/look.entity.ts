import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IDigest } from '@content/digests/interfaces';
import { StyleTagEntity } from '@content/style-tags/entities';
import { StyleTag } from '@content/style-tags/models';
import { User } from '@user/users/models';

import { ILook } from '../interfaces';
import { LookImage } from '../models';

@ObjectType()
@Entity({ name: 'look' })
export class LookEntity extends BaseIdEntity implements ILook {
  constructor(attributes?: Partial<LookEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.styleTags = attributes.styleTags;
    this.digests = attributes.digests;

    this.title = attributes.title;

    this.likeCount = attributes.likeCount;
    this.hitCount = attributes.hitCount;
    this.commentCount = attributes.commentCount;
    this.score = attributes.score;
  }

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @Field(() => [StyleTag])
  @ManyToMany(() => StyleTagEntity)
  @JoinTable()
  styleTags: StyleTag[];
  @OneToMany('LookImageEntity', 'look', { cascade: true })
  images: LookImage[];
  @OneToMany('DigestEntity', 'look', { cascade: true, onDelete: 'CASCADE' })
  digests: IDigest[];

  // 여기부터 정보 fields
  @Field({ description: '최대 길이 127' })
  @Column({ length: 127 })
  title: string;

  // queue에서 계산해서 update하는 값들
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  likeCount: number;
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  hitCount: number;
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  commentCount: number;
  @Field({ defaultValue: 0 })
  @Column({ type: 'float', default: 0 })
  score: number;
}
