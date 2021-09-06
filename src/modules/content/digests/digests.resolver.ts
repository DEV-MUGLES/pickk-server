import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
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

import { DigestRelationType, DIGEST_RELATIONS } from './constants';
import { DigestFilter, CreateDigestInput, UpdateDigestInput } from './dtos';
import { Digest } from './models';

import { DigestsService } from './digests.service';

@Injectable()
export class DigestsResolver extends BaseResolver<DigestRelationType> {
  relations = DIGEST_RELATIONS;

  constructor(
    private readonly digestsService: DigestsService,
    private readonly digestsSearchService: DigestsSearchService,
    private readonly likesService: LikesService
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

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async removeDigest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number
  ): Promise<boolean> {
    const isMine = await this.digestsService.checkBelongsTo(id, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 Digest가 아닙니다.');
    }

    await this.digestsService.remove(id);
    return true;
  }

  @Query(() => [Digest])
  async searchDigest(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Digest[]> {
    const ids = await this.digestsSearchService.search(query, pageInput);

    return await this.digestsService.list(
      { idIn: ids },
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

    return await this.digestsService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Digest)
  @UseGuards(JwtVerifyGuard)
  async createDigest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('createDigestInput') input: CreateDigestInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    const { id } = await this.digestsService.create({ ...input, userId });
    return await this.digestsService.get(
      id,
      this.getRelationsFromInfo(info),
      userId
    );
  }

  @Mutation(() => Digest)
  @UseGuards(JwtVerifyGuard)
  async updateDigest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('updateDigestInput') input: UpdateDigestInput,
    @Info() info?: GraphQLResolveInfo
  ) {
    const { id } = await this.digestsService.update({ ...input, userId });
    return await this.digestsService.get(
      id,
      this.getRelationsFromInfo(info),
      userId
    );
  }
}
