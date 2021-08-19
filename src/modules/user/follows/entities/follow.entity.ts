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

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  target: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  targetId: number;
}
