import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtVerifyGuard } from '@auth/guards';
import { PageInput } from '@common/dtos';

import { PointEventFilter } from './dtos';
import { ExpectedPointEvent, PointEvent } from './models';

import { PointsService } from './points.service';

@Resolver()
export class PointsResolver {
  constructor(@Inject(PointsService) private pointsService: PointsService) {}

  @Query(() => [PointEvent])
  @UseGuards(JwtVerifyGuard)
  async myPointEvents(
    @CurrentUser() payload: JwtPayload,
    @Args('pointEventFilter', { nullable: true })
    pointEventFilter?: PointEventFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<PointEvent[]> {
    return await this.pointsService.listEvents(
      { userId: payload.sub, ...pointEventFilter },
      pageInput
    );
  }

  @Query(() => [PointEvent])
  @UseGuards(JwtVerifyGuard)
  async myExpectedPointEvents(
    @CurrentUser() payload: JwtPayload,
    @Args('pointEventFilter', { nullable: true })
    pointEventFilter?: PointEventFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<ExpectedPointEvent[]> {
    return await this.pointsService.listExpectedEvents(
      { userId: payload.sub, ...pointEventFilter },
      pageInput
    );
  }
}
