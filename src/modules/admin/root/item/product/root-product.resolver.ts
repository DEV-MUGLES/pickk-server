import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import {
  ProductRelationType,
  PRODUCT_RELATIONS,
} from '@item/products/constants';
import { UpdateProductInput } from '@item/products/dtos';
import { Product } from '@item/products/models';
import { ProductsService } from '@item/products/products.service';
import { UserRole } from '@user/users/constants';

@Resolver(() => Product)
export class RootProductResolver extends BaseResolver<ProductRelationType> {
  relations = PRODUCT_RELATIONS;

  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Product)
  async updateRootProduct(
    @IntArgs('id') id: number,
    @Args('input') input: UpdateProductInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Product> {
    await this.productsService.update(id, input);
    return await this.productsService.get(id, this.getRelationsFromInfo(info));
  }
}
