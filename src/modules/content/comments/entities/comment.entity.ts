import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { IsBoolean, IsEnum } from 'class-validator';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { BaseIdEntity } from '@common/entities';
import { User } from '@user/users/models';

import { IComment } from '../interfaces';
import { CommentOwnerType } from '../constants';

@ObjectType()
@Entity({ name: 'comment' })
@Index('idx_ownerId-id', ['ownerId', 'id'])
@Index('idx_ownerId-ownerType-createdAt', ['ownerId', 'ownerType', 'createdAt'])
export class CommentEntity extends BaseIdEntity implements IComment {
  constructor(attributes?: Partial<CommentEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.ownerType = attributes.ownerType;
    this.ownerId = attributes.ownerId;

    this.parent = attributes.parent;
    this.parentId = attributes.parentId;
    this.mentionedUser = attributes.mentionedUser;
    this.mentionedUserId = attributes.mentionedUserId;

    this.content = attributes.content;
    this.isContentUpdated = attributes.isContentUpdated;
    this.isDeleted = attributes.isDeleted;

    this.contentUpdatedAt = attributes.contentUpdatedAt;

    this.likeCount = attributes.likeCount;

    this.isLiking = attributes.isLiking;
    this.isMine = attributes.isMine;
  }

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @Field(() => CommentOwnerType)
  @Column({ type: 'enum', enum: CommentOwnerType })
  @IsEnum(CommentOwnerType)
  ownerType: CommentOwnerType;
  @Field(() => Int)
  @Column({ type: 'int', unsigned: true })
  ownerId: number;

  @OneToMany('CommentEntity', 'parent', { cascade: true })
  replies: CommentEntity[];

  @ManyToOne('CommentEntity', { nullable: true })
  parent: CommentEntity;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  parentId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  mentionedUser: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  mentionedUserId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  content: string;
  @Field()
  @Column({ default: false })
  @IsBoolean()
  isContentUpdated: boolean;
  @Field()
  @Column({ default: false })
  @IsBoolean()
  isDeleted: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contentUpdatedAt: Date;

  // queue에서 계산해서 update하는 값들
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  likeCount: number;

  @Field({ description: '[MODEL ONLY]', nullable: true })
  isLiking: boolean;
  @Field({ description: '[MODEL ONLY]', nullable: true })
  isMine: boolean;
}
