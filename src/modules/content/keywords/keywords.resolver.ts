import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { KeywordRelationType, KEYWORD_RELATIONS } from './constants';
import { KeywordFilter } from './dtos';
import { Keyword } from './models';

import { KeywordsService } from './keywords.service';
import { KeywordsSearchService } from './keywords.search.service';

@Injectable()
export class KeywordsResolver extends BaseResolver<KeywordRelationType> {
  relations = KEYWORD_RELATIONS;

  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly keywordsSearchService: KeywordsSearchService
  ) {
    super();
  }

  @Query(() => [Keyword])
  @UseGuards(JwtOrNotGuard)
  async keywords(
    @CurrentUser() payload: JwtPayload,
    @Args('filter') filter: KeywordFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Keyword[]> {
    return await this.keywordsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }

  // @FIXME: keyword service inject 버그 때문에 비활성화 시킴
  // @Query(() => [Keyword])
  // async searchKeyword(
  //   @Args('query') query: string,
  //   @Args('pageInput', { nullable: true }) pageInput?: PageInput,
  //   @Info() info?: GraphQLResolveInfo
  // ): Promise<Keyword[]> {
  //   const ids = await this.keywordsSearchService.search(query, pageInput);

  //   return await this.keywordsService.list(
  //     { idIn: ids, hasCustom: null },
  //     null,
  //     this.getRelationsFromInfo(info)
  //   );
  // }
}
