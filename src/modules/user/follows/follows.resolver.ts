import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';

import { FollowsService } from './follows.service';

@Injectable()
export class FollowsResolver {
  constructor(
    @Inject(FollowsService) private readonly followsService: FollowsService
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async follow(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('targetId') targetId: number
  ) {
    await this.followsService.add(userId, targetId);
    return true;
  }

  @Mutation(() => Boolean, {
    description: '여러번 구독된 상태였다면 모두 삭제됩니다.',
  })
  @UseGuards(JwtVerifyGuard)
  async unfollow(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('targetId') targetId: number
  ) {
    await this.followsService.remove(userId, targetId);
    return true;
  }
}
