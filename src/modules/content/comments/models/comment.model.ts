import { Field, ObjectType } from '@nestjs/graphql';

import { CommentEntity } from '../entities';

@ObjectType()
export class Comment extends CommentEntity {
  @Field(() => [Comment])
  replies: Comment[];
  @Field(() => Comment, { nullable: true })
  parent: Comment;

  updateLikeCount(diff: number) {
    const result = this.likeCount + diff;
    this.likeCount = result < 0 ? 0 : result;
  }
}
