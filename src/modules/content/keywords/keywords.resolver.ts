import { Inject, Injectable, UseGuards } from '@nestjs/common';
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

@Injectable()
export class KeywordsResolver extends BaseResolver<KeywordRelationType> {
  relations = KEYWORD_RELATIONS;

  constructor(
    @Inject(KeywordsService) private readonly keywordsService: KeywordsService
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
}
