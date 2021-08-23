import { ObjectType } from '@nestjs/graphql';

import { KeywordClassEntity } from '../entities';

@ObjectType()
export class KeywordClass extends KeywordClassEntity {
  static keywordCountCacheKey(id: number) {
    return `keyword_class:${id}:keyword_count`;
  }
}
