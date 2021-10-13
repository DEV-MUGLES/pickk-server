import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { FindSaleStrategyInput, PageInput } from '@common/dtos';
import { IntArgs } from '@common/decorators';
import { UserRole } from '@user/users/constants';

import { SellerRelationType, SELLER_RELATIONS } from './constants';
import { SellerFilter, CreateSellerInput } from './dtos';
import { Seller } from './models';

import { SellersService } from './sellers.service';

@Resolver(() => Seller)
export class SellersResolver extends BaseResolver<SellerRelationType> {
  relations = SELLER_RELATIONS;

  constructor(private sellersService: SellersService) {
    super();
  }

  @Query(() => Seller)
  async seller(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller> {
    return await this.sellersService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Seller])
  async sellers(
    @Args('sellerFilter', { nullable: true }) sellerFilter?: SellerFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller[]> {
    return await this.sellersService.list(
      sellerFilter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Seller)
  async createSeller(
    @Args('createSellerInput') createSellerInput: CreateSellerInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller> {
    return await this.sellersService.create(
      createSellerInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Seller, {
    description: 'Admin 이상의 권한이 필요합니다.',
  })
  async updateSellerSaleStrategy(
    @IntArgs('sellerId') sellerId: number,
    @Args('updateSaleStrategyInput')
    updateSaleStrategyInput: FindSaleStrategyInput
  ): Promise<Seller> {
    return await this.sellersService.updateSaleStrategy(
      sellerId,
      updateSaleStrategyInput
    );
  }
}
