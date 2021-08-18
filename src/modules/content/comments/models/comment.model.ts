import { Field, ObjectType } from '@nestjs/graphql';

import { CommentEntity } from '../entities';

@ObjectType()
export class Comment extends CommentEntity {
  @Field(() => [Comment])
  replies: Comment[];
  @Field(() => Comment, { nullable: true })
  parent: Comment;
}
