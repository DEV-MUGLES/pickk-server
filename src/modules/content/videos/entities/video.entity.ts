import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { User } from '@user/users/models';

import { IVideo } from '../interfaces';
import { IDigest } from '@content/digests/interfaces';

@ObjectType()
@Entity({ name: 'video' })
export class VideoEntity extends BaseIdEntity implements IVideo {
  constructor(attributes?: Partial<VideoEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.digests = attributes.digests;
    this.comments = attributes.comments;

    this.youtubeCode = attributes.youtubeCode;
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

  @OneToMany('DigestEntity', 'video', { cascade: true, onDelete: 'CASCADE' })
  digests: IDigest[];
  // @TODO: comment 추가
  comments;

  // 여기부터 정보 fields
  @Field({ description: '최대 길이 40' })
  @Column({ length: 40 })
  youtubeCode: string;
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
