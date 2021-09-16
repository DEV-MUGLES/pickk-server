import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { User } from '@user/users/models';

import { CommentEntity } from '../entities';

@ObjectType()
export class Comment extends CommentEntity {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Comment, { nullable: true })
  parent: Comment;
  @Type(() => Comment)
  @Field(() => [Comment])
  replies: Comment[];
  @Field(() => User, { nullable: true })
  mentionedUser: User;
}
