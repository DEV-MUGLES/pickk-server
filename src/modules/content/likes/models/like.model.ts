import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@user/users/models';

import { LikeEntity } from '../entities';

@ObjectType()
export class Like extends LikeEntity {
  @Field(() => User, { nullable: true })
  user: User;
}
