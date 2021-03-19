import { Inject } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { BrandsService } from './brands.service';
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
}
