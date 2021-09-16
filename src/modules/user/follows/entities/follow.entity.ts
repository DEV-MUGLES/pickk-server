import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@user/users/models';

import { IFollow } from '../interfaces';

@ObjectType()
@Entity({ name: 'follow' })
export class FollowEntity implements IFollow {
  constructor(attributes?: Partial<FollowEntity>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.target = attributes.target;
    this.targetId = attributes.targetId;
  }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  user: User;
  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  target: User;
  @Field(() => Int)
  @Column()
  targetId: number;
}
