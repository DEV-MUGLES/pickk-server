import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { LookSearchService } from '@mcommon/search/look.search.service';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { LookRelationType, LOOK_RELATIONS } from './constants';
import { CreateLookInput, LookFilter, UpdateLookInput } from './dtos';
import { Look } from './models';

import { LooksService } from './looks.service';

@Injectable()
export class LooksResolver extends BaseResolver<LookRelationType> {
  relations = LOOK_RELATIONS;

  constructor(
    private readonly looksService: LooksService,
    private readonly lookSearchService: LookSearchService,
    private readonly likesService: LikesService
  ) {
    super();
  }

  @Query(() => Look)
  @UseGuards(JwtOrNotGuard)
  async look(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Look> {
    return await this.looksService.get(
      id,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
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
      { idIn: ids } as LookFilter,
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => [Look])
  @UseGuards(JwtVerifyGuard)
  async likingLooks(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('pageInput') pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Look[]> {
    const ids = await this.likesService.findOwnerIds(
      userId,
      LikeOwnerType.Look,
      pageInput
    );

    return await this.looksService.list(
      { idIn: ids } as LookFilter,
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Look)
  @UseGuards(JwtVerifyGuard)
  async createLook(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('createLookInput') input: CreateLookInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Look> {
    const { id } = await this.looksService.create(userId, input);
    return await this.looksService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => Look)
  @UseGuards(JwtVerifyGuard)
  async updateLook(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('updateLookInput') input: UpdateLookInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Look> {
    await this.looksService.checkBelongsTo(id, userId);

    await this.looksService.update(id, input);
    return await this.looksService.get(id, this.getRelationsFromInfo(info));
  }
}
