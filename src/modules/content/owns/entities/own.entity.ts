import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IKeyword } from '@content/keywords/interfaces';
import { IUser } from '@user/users/interfaces';

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

  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  user: IUser;
  @Field(() => Int)
  @Column()
  userId: number;

  @ManyToOne('KeywordEntity', { onDelete: 'CASCADE' })
  keyword: IKeyword;
  @Field(() => Int)
  @Column()
  keywordId: number;
}
