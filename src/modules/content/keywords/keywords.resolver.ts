import { Inject, Injectable } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { KeywordRelationType, KEYWORD_RELATIONS } from './constants';
import { KeywordFilter } from './dtos';
import { Keyword } from './models';

import { KeywordsService } from './keywords.service';

@Injectable()
export class KeywordsResolver extends BaseResolver<KeywordRelationType> {
  relations = KEYWORD_RELATIONS;

  constructor(
    @Inject(KeywordsService) private readonly keywordsService: KeywordsService
  ) {
    super();
  }

  @Query(() => [Keyword])
  async keywords(
    @Args('filter', { nullable: true }) filter?: KeywordFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Keyword[]> {
    return await this.keywordsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
