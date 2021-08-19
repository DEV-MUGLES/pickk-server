import { Inject, Injectable } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { LookRelationType, LOOK_RELATIONS } from './constants';
import { LookFilter } from './dtos';
import { Look } from './models';

import { LooksService } from './looks.service';

@Injectable()
export class LooksResolver extends BaseResolver<LookRelationType> {
  relations = LOOK_RELATIONS;

  constructor(
    @Inject(LooksService) private readonly looksService: LooksService
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
}
