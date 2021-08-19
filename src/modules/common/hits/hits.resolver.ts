import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { JwtOrIpGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';

import { HitOwnerType } from './constants';
import { HitsService } from './hits.service';

@Injectable()
export class HitsResolver {
  constructor(@Inject(HitsService) private readonly hitsService: HitsService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtOrIpGuard)
  async hit(
    @CurrentUser() payloadOrIp: JwtPayload | string,
    @Args('ownerType', { type: () => HitOwnerType }) ownerType: HitOwnerType,
    @Args('ownerId') ownerId: number
  ): Promise<boolean> {
    const id =
      typeof payloadOrIp === 'string'
        ? payloadOrIp
        : payloadOrIp.sub.toString();

    if (await this.hitsService.isEarly(ownerType, ownerId, id)) {
      return false;
    }

    await this.hitsService.add(ownerType, ownerId);

    return true;
  }
}
