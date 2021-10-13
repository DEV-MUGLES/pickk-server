import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { JwtSellerVerifyGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import {
  ProductRelationType,
  PRODUCT_RELATIONS,
} from '@item/products/constants';
import {
  CreateProductShippingReservePolicyInput,
  UpdateProductShippingReservePolicyInput,
} from '@item/products/dtos';
import { Product } from '@item/products/models';
import { ProductsService } from '@item/products/products.service';

@Resolver(() => Product)
export class SellerProductResolver extends BaseResolver<ProductRelationType> {
  relations = PRODUCT_RELATIONS;

  constructor(private readonly productsService: ProductsService) {
    super();
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Product)
  async createShippingReservePolicy(
    @IntArgs('productId') productId: number,
    @Args('createProductShippingReservePolicyInput')
    input: CreateProductShippingReservePolicyInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Product> {
    await this.productsService.createShippingReservePolicy(productId, input);
    return await this.productsService.get(
      productId,
      this.getRelationsFromInfo(info)
    );
  }

  @UseGuards(JwtSellerVerifyGuard)
  @Mutation(() => Product)
  async updateShippingReservePolicy(
    @IntArgs('productId') productId: number,
    @Args('updateProductShippingReservePolicyInput')
    input: UpdateProductShippingReservePolicyInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Product> {
    await this.productsService.updateShippingReservePolicy(productId, input);
    return await this.productsService.get(
      productId,
      this.getRelationsFromInfo(info)
    );
  }
}
