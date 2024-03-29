import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Query, Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';

import { LikeOwnerType } from './constants';

import { LikesService } from './likes.service';

@Injectable()
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Query(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async checkLiking(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('ownerType', { type: () => LikeOwnerType }) ownerType: LikeOwnerType,
    @IntArgs('ownerId') ownerId: number
  ) {
    return await this.likesService.check(userId, ownerType, ownerId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async like(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('ownerType', { type: () => LikeOwnerType }) ownerType: LikeOwnerType,
    @IntArgs('ownerId') ownerId: number
  ) {
    await this.likesService.add(userId, ownerType, ownerId);
    return true;
  }

  @Mutation(() => Boolean, {
    description: '여러번 좋아요한 상태였다면 모두 삭제됩니다.',
  })
  @UseGuards(JwtVerifyGuard)
  async unlike(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('ownerType', { type: () => LikeOwnerType }) ownerType: LikeOwnerType,
    @IntArgs('ownerId') ownerId: number
  ) {
    await this.likesService.remove(userId, ownerType, ownerId);
    return true;
  }
}
