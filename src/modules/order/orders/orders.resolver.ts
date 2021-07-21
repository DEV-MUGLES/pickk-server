import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { ProductsService } from '@item/products/products.service';

@Injectable()
export class OrdersResolver {
  constructor(private readonly productsService: ProductsService) {}
}
