import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@src/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@src/authentication/guards';
import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { UserRole } from '@src/modules/user/users/constants/user.enum';

import { SELLER_RELATIONS } from './constants/seller.relation';
import { CreateSellerInput } from './dtos/seller.input';
import { Seller } from './models/seller.model';
import { SellersService } from './sellers.service';

@Resolver(() => Seller)
export class SellersResolver extends BaseResolver {
  relations = SELLER_RELATIONS;

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

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Seller)
  async createSeller(
    @Args('createSellerInput') createSellerInput: CreateSellerInput
  ): Promise<Seller> {
    return await this.sellersService.create(createSellerInput);
  }
}
