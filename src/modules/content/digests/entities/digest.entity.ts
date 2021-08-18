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

import { IVideo } from '@content/videos/interfaces';
import { ItemPropertyValueEntity } from '@item/item-properties/entities';
import { ItemPropertyValue } from '@item/item-properties/models';
import { Item } from '@item/items/models';
import { User } from '@user/users/models';

import { IDigest } from '../interfaces';
import { DigestImage } from '../models';
import { Rating } from '../scalars';

@ObjectType()
@Entity({ name: 'digest' })
export class DigestEntity extends BaseIdEntity implements IDigest {
  constructor(attributes?: Partial<DigestEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;
    this.user = attributes.user;
    this.userId = attributes.userId;

    this.video = attributes.video;
    this.videoId = attributes.videoId;
    this.look = attributes.look;
    this.lookId = attributes.lookId;

    this.itemPropertyValues = attributes.itemPropertyValues;
    this.images = attributes.images;
    this.comments = attributes.comments;

    this.size = attributes.size;

    this.rating = attributes.rating;
    this.title = attributes.title;
    this.content = attributes.content;
    this.timestampStartSecond = attributes.timestampStartSecond;
    this.timestampEndSecond = attributes.timestampEndSecond;

    this.likeCount = attributes.likeCount;
    this.hitCount = attributes.hitCount;
    this.commentCount = attributes.commentCount;
    this.score = attributes.score;
  }

  @Field(() => Item, { nullable: true })
  @ManyToOne('ItemEntity', { nullable: true })
  item: Item;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  itemId: number;
  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  // @TODO: video, look 추가
  @ManyToOne('VideoEntity')
  video: IVideo;
  @Column({ type: 'int', nullable: true })
  videoId: number;
  look;
  lookId: number;

  @Field(() => [ItemPropertyValue])
  @ManyToMany(() => ItemPropertyValueEntity)
  @JoinTable()
  itemPropertyValues: ItemPropertyValue[];
  @OneToMany('DigestImageEntity', 'item', { cascade: true })
  images: DigestImage[];
  // @TODO: comment 추가
  comments;

  // 여기부터 정보 fields
  @Field()
  @Column({ length: 30 })
  size: string;

  // 여기부터 꿀템만 있는 값들
  @Field(() => Rating, { nullable: true })
  @Column({ type: 'tinyint', nullable: true })
  rating: number;

  @Field({ description: '최대 길이 127', nullable: true })
  @Column({ length: 127, nullable: true })
  title: string;
  @Field({ description: '최대 길이 2047', nullable: true })
  @Column({ length: 2047, nullable: true })
  content: string;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  timestampStartSecond: number;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  timestampEndSecond: number;

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
