import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';

import { OwnsService } from './owns.service';

@Injectable()
export class OwnsResolver {
  constructor(@Inject(OwnsService) private readonly ownsService: OwnsService) {}

  @Query(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async checkOwning(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('keywordId') keywordId: number
  ) {
    return await this.ownsService.check(userId, keywordId);
  }
}
