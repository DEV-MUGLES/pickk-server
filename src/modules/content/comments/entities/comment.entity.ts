import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { IsBoolean, IsEnum } from 'class-validator';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Optional } from '@nestjs/common';

import { BaseIdEntity } from '@common/entities';
import { User } from '@user/users/models';

import { IComment } from '../interfaces';
import { CommentOwnerType } from '../constants';

@ObjectType()
@Entity({ name: 'comment' })
@Index('idx_ownerId-id', ['ownerId', 'id'])
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

    this.likeCount = attributes.likeCount;

    this.isDeleted = attributes.isDeleted;
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

  // queue에서 계산해서 update하는 값들
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  likeCount: number;

  @Field({ defaultValue: false })
  @Column({ default: false })
  @IsBoolean()
  @Optional()
  isDeleted: boolean;
}
