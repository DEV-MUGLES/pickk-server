import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { DigestRelationType, DIGEST_RELATIONS } from './constants';
import { DigestFilter } from './dtos';
import { Digest } from './models';

import { DigestsService } from './digests.service';

@Injectable()
export class DigestsResolver extends BaseResolver<DigestRelationType> {
  relations = DIGEST_RELATIONS;

  constructor(
    @Inject(DigestsService) private readonly digestsService: DigestsService
  ) {
    super();
  }

  @Query(() => Digest)
  @UseGuards(JwtOrNotGuard)
  async digest(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest> {
    return await this.digestsService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Digest])
  @UseGuards(JwtOrNotGuard)
  async digests(
    @CurrentUser() payload: JwtPayload,
    @Args('filter', { nullable: true }) filter?: DigestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest[]> {
    return await this.digestsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }
}
