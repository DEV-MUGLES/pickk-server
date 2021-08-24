import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
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

  @Query(() => [Keyword])
  @UseGuards(JwtOrNotGuard)
  async keywordsByClass(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('keywordClassId') keywordClassId: number,
    @Args('isOwning', { nullable: true }) isOwning: boolean,
    @Info() info?: GraphQLResolveInfo,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<Keyword[]> {
    return await this.keywordsService.listByClass(
      keywordClassId,
      payload?.sub,
      isOwning,
      this.getRelationsFromInfo(info),
      pageInput
    );
  }
}
