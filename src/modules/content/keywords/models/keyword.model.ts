import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';
import { Look } from '@content/looks/models';
import { StyleTag } from '@content/style-tags/models';

import { KeywordEntity } from '../entities';

import { KeywordClass } from './keyword-class.model';
import { KeywordDigest } from './keyword-digest.model';
import { KeywordLook } from './keyword-look.model';

@ObjectType()
export class Keyword extends KeywordEntity {
  @Field(() => [KeywordClass])
  classes: KeywordClass[];

  @Field(() => [StyleTag])
  styleTags: StyleTag[];

  keywordLooks: KeywordLook[];
  keywordDigests: KeywordDigest[];

  @Field(() => [Look])
  @Type(() => Look)
  get looks(): Look[] {
    if (!this.keywordLooks) {
      return [];
    }

    return this.keywordLooks
      .sort((a, b) => a.order - b.order)
      .map((v) => v.look);
  }
  @Field(() => [Digest])
  @Type(() => Digest)
  get digests(): Digest[] {
    if (!this.keywordDigests) {
      return [];
    }

    return this.keywordDigests
      .sort((a, b) => a.order - b.order)
      .map((v) => v.digest);
  }

  @Field(() => [Keyword])
  relatedKeywords: Keyword[];
}
