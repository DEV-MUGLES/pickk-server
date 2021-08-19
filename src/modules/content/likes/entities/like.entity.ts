import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';

import { User } from '@user/users/models';

import { LikeOwnerType } from '../constants';
import { ILike } from '../interfaces';

@ObjectType()
@Entity({ name: 'like' })
@Index('idx_ownerId-id', ['ownerId', 'id'])
export class LikeEntity implements ILike {
  constructor(attributes?: Partial<LikeEntity>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.ownerType = attributes.ownerType;
    this.ownerId = attributes.ownerId;
  }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @Field(() => LikeOwnerType)
  @Column({ type: 'enum', enum: LikeOwnerType })
  @IsEnum(LikeOwnerType)
  ownerType: LikeOwnerType;
  @Field(() => Int)
  @Column({ type: 'int', unsigned: true })
  ownerId: number;
}
