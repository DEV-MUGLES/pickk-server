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

import { IUser } from '@user/users/interfaces';

import { LikeOwnerType } from '../constants';
import { ILike } from '../interfaces';

@ObjectType()
@Entity({ name: 'like' })
@Index('idx-ownerId-userId', ['ownerId', 'userId'])
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

  @ManyToOne('UserEntity', { onDelete: 'CASCADE', nullable: true })
  user: IUser;
  @Field(() => Int, { nullable: true })
  @Column()
  userId: number;

  @Field(() => LikeOwnerType)
  @Column({ type: 'enum', enum: LikeOwnerType })
  @IsEnum(LikeOwnerType)
  ownerType: LikeOwnerType;
  @Field(() => Int)
  @Column({ type: 'int' })
  ownerId: number;
}
