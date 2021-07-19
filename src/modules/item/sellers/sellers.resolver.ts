import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { FindSaleStrategyInput, PageInput } from '@common/dtos';
import { IntArgs } from '@common/decorators';
import { SaleStrategy } from '@common/models';
import { UserRole } from '@user/users/constants/user.enum';

import { SELLER_RELATIONS } from './constants/seller.relation';
import { SellerFilter } from './dtos/seller.filter';
import { CreateSellerInput } from './dtos/seller.input';
import { Seller } from './models';
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
  @Mutation(() => SaleStrategy, {
    description:
      '입력한 seller의 saleStrategy를 변경합니다. Admin 이상의 권한이 필요합니다.',
  })
  async updateSellerSaleStrategy(
    @IntArgs('sellerId') sellerId: number,
    @Args('updateSaleStrategyInput')
    updateSaleStrategyInput: FindSaleStrategyInput
  ): Promise<SaleStrategy> {
    const seller = await this.sellersService.get(sellerId);
    return await this.sellersService.updateSaleStrategy(
      seller,
      updateSaleStrategyInput
    );
  }
}
