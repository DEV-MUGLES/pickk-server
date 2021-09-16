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

import { ILook, ILookImage } from '../interfaces';

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

    this.images = attributes.images;
    this.digests = attributes.digests;

    this.title = attributes.title;

    this.likeCount = attributes.likeCount;
    this.hitCount = attributes.hitCount;
    this.commentCount = attributes.commentCount;
    this.score = attributes.score;

    this.isLiking = attributes.isLiking;
    this.isMine = attributes.isMine;
  }

  @ManyToOne('UserEntity', { onDelete: 'SET NULL', nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userId: number;

  @ManyToMany(() => StyleTagEntity)
  @JoinTable()
  styleTags: StyleTag[];
  @OneToMany('LookImageEntity', 'look', { cascade: true })
  images: ILookImage[];
  @OneToMany('DigestEntity', 'look', { cascade: true })
  digests: IDigest[];

  // 여기부터 정보 fields
  @Field({ description: '최대 길이 127' })
  @Column({ length: 127 })
  title: string;

  // queue에서 계산해서 update하는 값들
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  likeCount: number;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  hitCount: number;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  commentCount: number;
  @Field()
  @Column({ type: 'float', default: 0 })
  score: number;

  @Field({ description: '[MODEL ONLY]', nullable: true })
  isLiking: boolean;
  @Field({ description: '[MODEL ONLY]', nullable: true })
  isMine: boolean;
}
