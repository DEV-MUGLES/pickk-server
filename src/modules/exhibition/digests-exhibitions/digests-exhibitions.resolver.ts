import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { UserRole } from '@user/users/constants';

import {
  DigestsExhibitionRelationType,
  DIGESTS_EXHIBITION_RELATIONS,
} from './constants';
import { DigestsExhibition } from './models';

import { DigestsExhibitionsService } from './digests-exhibitions.service';

@Injectable()
export class DigestsExhibitionsResolver extends BaseResolver<DigestsExhibitionRelationType> {
  relations = DIGESTS_EXHIBITION_RELATIONS;

  constructor(
    private readonly digestsExhibitionsService: DigestsExhibitionsService
  ) {
    super();
  }

  @Query(() => [DigestsExhibition])
  async digestsExhibitions(): Promise<DigestsExhibition[]> {
    return await this.digestsExhibitionsService.list(this.relations);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => DigestsExhibition)
  async updateDigestsExhibitionDigests(
    @IntArgs('id') id: number,
    @Args('digestIds', { type: () => [Int] }) digestIds: number[],
    @Info() info?: GraphQLResolveInfo
  ): Promise<DigestsExhibition> {
    await this.digestsExhibitionsService.updateDigests(id, digestIds);

    return await this.digestsExhibitionsService.get(
      id,
      this.getRelationsFromInfo(info)
    );
  }
}
