import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';
import { SellersService } from '@item/sellers/sellers.service';
import { UserRole } from '@user/users/constants';
import { User } from '@user/users/models';

import { BRAND_RELATIONS } from './constants';
import { UpdateBrandInput } from './dtos';
import { Brand } from './models';
import { BrandsService } from './brands.service';

@Resolver(() => Brand)
export class BrandsResolver extends BaseResolver {
  relations = BRAND_RELATIONS;

  constructor(
    @Inject(BrandsService) private brandsService: BrandsService,
    @Inject(SellersService) private sellersService: SellersService
  ) {
    super();
  }

  @Query(() => Brand)
  async brand(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Brand> {
    return await this.brandsService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Brand])
  async brands(@Info() info?: GraphQLResolveInfo): Promise<Brand[]> {
    return await this.brandsService.list(this.getRelationsFromInfo(info));
  }

  @Roles(UserRole.Seller)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Brand)
  async updateBrand(
    @CurrentUser() user: User,
    @IntArgs('id') id: number,
    @Args('updateBrandInput') updateBrandInput: UpdateBrandInput
  ): Promise<Brand> {
    if (user.role === UserRole.Seller) {
      const seller = await this.sellersService.findOne({ userId: user.id });
      if (seller?.brandId !== id) {
        throw new UnauthorizedException('자신의 브랜드만 수정할 수 있습니다.');
      }
    }

    return await this.brandsService.update(id, updateBrandInput);
  }
}
