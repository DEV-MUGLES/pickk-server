import { Inject } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { CouriersService } from './couriers.service';
import { Courier } from './models/courier.model';

@Resolver()
export class CouriersResolver extends BaseResolver {
  constructor(@Inject(CouriersService) private couriersService) {
    super();
  }

  @Query(() => Courier)
  async courier(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Courier> {
    return await this.couriersService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Courier])
  async couriers(@Info() info?: GraphQLResolveInfo): Promise<Courier[]> {
    return await this.couriersService.list(this.getRelationsFromInfo(info));
  }
}
