import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Keyword } from '@content/keywords/models';
import { User } from '@user/users/models';

import { OwnEntity } from '../entities';

@ObjectType()
export class Own extends OwnEntity {
  static owningCountCacheKey(userId: number, keywordClassId: number): string {
    return `user:${userId}:keywordClass:${keywordClassId}:owning`;
  }

  @Type(() => User)
  @Field(() => User)
  user: User;

  @Type(() => Keyword)
  @Field(() => Keyword)
  keyword: Keyword;
}
