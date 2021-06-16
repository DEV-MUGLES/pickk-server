import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtVerifyGuard } from '@auth/guards';
import { PageInput } from '@common/dtos/pagination.dto';

import { PointEventFilter } from './dtos/point-event.filter';
import { PointEvent } from './models/point-event.model';
import { PointsService } from './points.service';

@Resolver()
export class PointsResolver {
  constructor(@Inject(PointsService) private pointsService: PointsService) {}

  @Query(() => [PointEvent])
  @UseGuards(JwtVerifyGuard)
  async myPointEvents(
    @CurrentUser() payload: JwtPayload,
    @Args('itemFilter', { nullable: true }) pointEventFilter?: PointEventFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<PointEvent[]> {
    return await this.pointsService.list(
      { userId: payload.sub, ...pointEventFilter },
      pageInput
    );
  }
}
