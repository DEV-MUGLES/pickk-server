import { Field, InputType, Int } from '@nestjs/graphql';

import { CommentOwnerType } from '../constants';
import { IComment } from '../interfaces';

@InputType()
export class CommentFilter implements Partial<IComment> {
  @Field(() => CommentOwnerType, { nullable: true })
  ownerType: CommentOwnerType;
  @Field(() => Int, { nullable: true })
  ownerId: number;

  @Field(() => Boolean, { nullable: true })
  parentIdIsNull: boolean;
}
