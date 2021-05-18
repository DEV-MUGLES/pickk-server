import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';

import { UpdateProductInput } from './dtos/product.input';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver extends BaseResolver {
  relations = ['item', 'itemOptionValues'];

  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService
  ) {
    super();
  }

  @Mutation(() => Product)
  async updateProduct(
    @IntArgs('id') id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Product> {
    const product = await this.productsService.get(id);
    return await this.productsService.update(
      product,
      updateProductInput,
      this.getRelationsFromInfo(info)
    );
  }
}
