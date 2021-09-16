import { Field, ObjectType } from '@nestjs/graphql';

import { Digest } from '@content/digests/models';
import { Look } from '@content/looks/models';
import { StyleTag } from '@content/style-tags/models';

import { KeywordEntity } from '../entities';

import { KeywordClass } from './keyword-class.model';

@ObjectType()
export class Keyword extends KeywordEntity {
  @Field(() => [KeywordClass])
  classes: KeywordClass[];

  @Field(() => [StyleTag])
  styleTags: StyleTag[];
  @Field(() => [Look])
  looks: Look[];
  @Field(() => [Digest])
  digests: Digest[];

  @Field(() => [Keyword])
  relatedKeywords: Keyword[];
}
