import { Inject } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';

import { Seller } from './models/seller.model';
import { SellersService } from './sellers.service';

@Resolver(() => Seller)
export class SellersResolver extends BaseResolver {
  relations = ['user', 'brand', 'saleStrategy'];

  constructor(@Inject(SellersService) private sellersService: SellersService) {
    super();
  }

  @Query(() => Seller)
  async seller(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller> {
    return await this.sellersService.get(id, this.getRelationsFromInfo(info));
  }
}
