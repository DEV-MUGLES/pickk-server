import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@src/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@src/authentication/guards';
import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { UserRole } from '@src/modules/user/users/constants/user.enum';

import { Seller } from './models/seller.model';
import { SellersService } from './sellers.service';
import { CreateSellerInput } from './dto/seller.input';

@Resolver(() => Seller)
export class SellersResolver extends BaseResolver {
  relations = ['user', 'brand', 'saleStrategy', 'shippingPolicy'];

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
