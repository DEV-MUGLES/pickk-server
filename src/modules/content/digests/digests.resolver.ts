import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
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
}
