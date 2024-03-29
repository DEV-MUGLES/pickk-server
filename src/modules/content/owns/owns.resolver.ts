import { Injectable, UseGuards } from '@nestjs/common';
import { Mutation, Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';

import { OwnsCountOutput } from './dtos';

import { OwnsService } from './owns.service';

@Injectable()
export class OwnsResolver {
  constructor(private readonly ownsService: OwnsService) {}

  @Query(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async checkOwning(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('keywordId') keywordId: number
  ) {
    return await this.ownsService.check(userId, keywordId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async own(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('keywordId') keywordId: number
  ): Promise<boolean> {
    await this.ownsService.add(userId, keywordId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async unown(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('keywordId') keywordId: number
  ): Promise<boolean> {
    await this.ownsService.remove(userId, keywordId);
    return true;
  }

  @Query(() => OwnsCountOutput)
  @UseGuards(JwtOrNotGuard)
  async meOwnsCount(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('keywordClassId') keywordClassId: number
  ): Promise<OwnsCountOutput> {
    return await this.ownsService.getCount(payload?.sub, keywordClassId);
  }
}
