import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '@src/authentication/decorators/current-user.decorator';
import { Roles } from '@src/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@src/authentication/guards';
import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { UserRole } from '@src/modules/user/users/constants/user.enum';
import { User } from '@src/modules/user/users/models/user.model';
import { GraphQLResolveInfo } from 'graphql';
import { SellersService } from '../sellers/sellers.service';
import { BrandsService } from './brands.service';
import { UpdateBrandInput } from './dtos/brand.input';
import { Brand } from './models/brand.model';

@Resolver(() => Brand)
export class BrandsResolver extends BaseResolver {
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
