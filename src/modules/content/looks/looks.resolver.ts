import { Injectable } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { LookSearchService } from '@mcommon/search/look.search.service';

import { LookRelationType, LOOK_RELATIONS } from './constants';
import { LookFilter } from './dtos';
import { Look } from './models';

import { LooksService } from './looks.service';

@Injectable()
export class LooksResolver extends BaseResolver<LookRelationType> {
  relations = LOOK_RELATIONS;

  constructor(
    private readonly looksService: LooksService,
    private readonly lookSearchService: LookSearchService
  ) {
    super();
  }

  @Query(() => [Look])
  async looks(
    @Args('filter', { nullable: true }) filter?: LookFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Look[]> {
    return await this.looksService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => [Look])
  async searchLook(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Look[]> {
    const ids = await this.lookSearchService.search(query, pageInput);

    return await this.looksService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }
}
