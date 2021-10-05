import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { ProductRelationType, PRODUCT_RELATIONS } from './constants';
import { UpdateProductInput } from './dtos';
import { Product } from './models';

import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver extends BaseResolver<ProductRelationType> {
  relations = PRODUCT_RELATIONS;

  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @Mutation(() => Product)
  async updateProduct(
    @IntArgs('id') id: number,
    @Args('updateProductInput') input: UpdateProductInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Product> {
    await this.productsService.update(id, input);
    return await this.productsService.get(id, this.getRelationsFromInfo(info));
  }
}
