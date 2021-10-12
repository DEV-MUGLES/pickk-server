import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtVerifyGuard } from '@auth/guards';
import { PageInput } from '@common/dtos';

import { UserLogsService } from '@user/user-logs/user-logs.service';

import { PointSign } from './constants';
import { PointEventFilter } from './dtos';
import { ExpectedPointEvent, PointEvent } from './models';

import { PointsService } from './points.service';

@Resolver()
export class PointsResolver {
  constructor(
    private readonly pointsService: PointsService,
    private readonly userLogsService: UserLogsService
  ) {}

  @Query(() => [PointEvent])
  @UseGuards(JwtVerifyGuard)
  async myPointEvents(
    @CurrentUser() payload: JwtPayload,
    @Args('pointEventFilter', { nullable: true })
    pointEventFilter?: PointEventFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<PointEvent[]> {
    return await this.pointsService.list(
      { userId: payload.sub, ...pointEventFilter },
      pageInput
    );
  }

  @Query(() => [PointEvent])
  @UseGuards(JwtVerifyGuard)
  async myExpectedPointEvents(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('pointEventFilter', { nullable: true })
    pointEventFilter?: PointEventFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<ExpectedPointEvent[]> {
    return await this.pointsService.listExpected(
      { userId, ...pointEventFilter },
      pageInput
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async requestAppInstallPoint(
    @CurrentUser() { sub: userId }: JwtPayload
  ): Promise<true> {
    await this.userLogsService.checkAppInstalled(userId);

    await this.pointsService.create({
      userId,
      title: '앱 설치 보상',
      amount: 15000,
      sign: PointSign.Plus,
      orderItemMerchantUid: null,
    });

    await this.userLogsService.createAppInstallLog(userId);
    return true;
  }
}
