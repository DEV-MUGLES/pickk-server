import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Keyword } from '@content/keywords/models';
import { User } from '@user/users/models';

import { IOwn } from '../interfaces';

@ObjectType()
@Entity({ name: 'own' })
export class OwnEntity implements IOwn {
  constructor(attributes?: Partial<OwnEntity>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.keyword = attributes.keyword;
    this.keywordId = attributes.keywordId;
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

  @Field(() => Keyword, { nullable: true })
  @ManyToOne('KeywordEntity', { nullable: true })
  keyword: Keyword;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  keywordId: number;
}
