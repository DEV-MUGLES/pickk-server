import { Injectable, UseGuards } from '@nestjs/common';
import { Mutation, Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';

import { FollowOutput } from './dtos';

import { FollowsService } from './follows.service';

@Injectable()
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Query(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async checkFollowing(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('targetId') targetId: number
  ) {
    return await this.followsService.check(userId, targetId);
  }

  @Mutation(() => FollowOutput)
  @UseGuards(JwtVerifyGuard)
  async follow(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('targetId') targetId: number
  ): Promise<FollowOutput> {
    await this.followsService.add(userId, targetId);

    return {
      id: targetId,
      isFollowing: true,
    };
  }

  @Mutation(() => FollowOutput, {
    description: '여러번 구독된 상태였다면 모두 삭제됩니다.',
  })
  @UseGuards(JwtVerifyGuard)
  async unfollow(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('targetId') targetId: number
  ): Promise<FollowOutput> {
    await this.followsService.remove(userId, targetId);

    return {
      id: targetId,
      isFollowing: false,
    };
  }
}
