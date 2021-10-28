import { Info, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { ProductRelationType, PRODUCT_RELATIONS } from './constants';
import { Product } from './models';

import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver extends BaseResolver<ProductRelationType> {
  relations = PRODUCT_RELATIONS;

  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @Query(() => Product)
  async product(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Product> {
    return await this.productsService.get(id, this.getRelationsFromInfo(info));
  }
}
