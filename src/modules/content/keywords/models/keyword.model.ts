import { Field, ObjectType } from '@nestjs/graphql';

import { KeywordEntity } from '../entities';

@ObjectType()
export class Keyword extends KeywordEntity {
  @Field(() => [Keyword])
  relatedKeywords: Keyword[];
}
