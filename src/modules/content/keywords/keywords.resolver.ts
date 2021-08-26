import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { KeywordSearchService } from '@mcommon/search/keyword.search.service';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { KeywordRelationType, KEYWORD_RELATIONS } from './constants';
import { KeywordFilter } from './dtos';
import { Keyword } from './models';

import { KeywordsService } from './keywords.service';

@Injectable()
export class KeywordsResolver extends BaseResolver<KeywordRelationType> {
  relations = KEYWORD_RELATIONS;

  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly keywordsSearchService: KeywordSearchService,
    private readonly likesService: LikesService
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

  @Query(() => [Keyword])
  async searchKeyword(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Keyword[]> {
    const ids = await this.keywordsSearchService.search(query, pageInput);

    return await this.keywordsService.list(
      { idIn: ids, hasCustom: null },
      null,
      this.getRelationsFromInfo(info)
    );
  }

  // @TODO: 제거
  @Mutation(() => Boolean)
  async indexKeyword() {
    await this.keywordsSearchService.index(1);
  }

  @Query(() => [Keyword])
  @UseGuards(JwtVerifyGuard)
  async likingKeywords(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('pageInput') pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Keyword[]> {
    const ids = await this.likesService.findOwnerIds(
      userId,
      LikeOwnerType.Keyword,
      pageInput
    );

    return await this.keywordsService.list(
      { idIn: ids, hasCustom: null },
      null,
      this.getRelationsFromInfo(info)
    );
  }
}
