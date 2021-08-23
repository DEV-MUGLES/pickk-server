import { ObjectType } from '@nestjs/graphql';

import { OwnEntity } from '../entities';

@ObjectType()
export class Own extends OwnEntity {
  static countCacheKey(userId: number, keywordClassId: number): string {
    return `user:${userId}:keywordClass:${keywordClassId}:own`;
  }
}
