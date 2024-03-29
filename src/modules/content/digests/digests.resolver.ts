import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { DigestsSearchService } from '@mcommon/search/digest.search.service';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { ItemsGroupsService } from '@exhibition/items-groups/items-groups.service';

import { DigestRelationType, DIGEST_RELATIONS } from './constants';
import { DigestFilter, CreateDigestInput, UpdateDigestInput } from './dtos';
import { Digest } from './models';
import { DigestsProducer } from './producers';

import { DigestsService } from './digests.service';

@Injectable()
export class DigestsResolver extends BaseResolver<DigestRelationType> {
  relations = DIGEST_RELATIONS;

  constructor(
    private readonly digestsService: DigestsService,
    private readonly digestsSearchService: DigestsSearchService,
    private readonly likesService: LikesService,
    private readonly digestsProducer: DigestsProducer,
    private readonly itemsGroupsService: ItemsGroupsService
  ) {
    super();
  }

  @Query(() => Digest)
  @UseGuards(JwtOrNotGuard)
  async digest(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest> {
    return await this.digestsService.get(
      id,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
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

  @Query(() => [Digest])
  async searchDigest(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest[]> {
    const { ids } = await this.digestsSearchService.search(query, pageInput);

    return await this.digestsService.list(
      { idIn: ids } as DigestFilter,
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => [Digest])
  @UseGuards(JwtVerifyGuard)
  async likingDigests(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('pageInput') pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest[]> {
    const ids = await this.likesService.findOwnerIds(
      userId,
      LikeOwnerType.Digest,
      pageInput
    );

    return await this.digestsService.likingListByIds(
      ids,
      this.getRelationsFromInfo(info),
      userId
    );
  }

  @Mutation(() => Digest)
  @UseGuards(JwtVerifyGuard)
  async createDigest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('createDigestInput') input: CreateDigestInput
  ) {
    const digest = await this.digestsService.create(userId, input);
    await this.digestsProducer.sendDigestCreationSlackMessage(digest.id);
    return digest;
  }

  @Mutation(() => Digest)
  @UseGuards(JwtVerifyGuard)
  async updateDigest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('updateDigestInput') input: UpdateDigestInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    await this.digestsService.checkBelongsTo(id, userId);

    await this.digestsService.update(id, input);
    return await this.digestsService.get(
      id,
      this.getRelationsFromInfo(info),
      userId
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async removeDigest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number
  ): Promise<boolean> {
    await this.digestsService.checkBelongsTo(id, userId);
    await this.digestsService.remove(id);
    return true;
  }

  @Query(() => [Digest])
  @UseGuards(JwtOrNotGuard)
  async itemsGroupDigests(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('itemId') itemId: number,
    @Args('filter', { nullable: true }) filter?: DigestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest[]> {
    const itemIds = await this.itemsGroupsService.findGroupItemIds(itemId);

    return await this.digestsService.list(
      { ...filter, itemIdIn: itemIds } as DigestFilter,
      pageInput,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }
}
