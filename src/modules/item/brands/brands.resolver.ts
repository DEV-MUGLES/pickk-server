import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { BrandsService } from './brands.service';
import { UpdateBrandInput } from './dtos/brand.input';
import { Brand } from './models/brand.model';

@Resolver(() => Brand)
export class BrandsResolver extends BaseResolver {
  constructor(@Inject(BrandsService) private brandsService: BrandsService) {
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

  @Mutation(() => Brand)
  async updateBrand(
    @IntArgs('id') id: number,
    @Args('updateBrandInput') updateBrandInput: UpdateBrandInput
  ): Promise<Brand> {
    return await this.brandsService.update(id, updateBrandInput);
  }
}
