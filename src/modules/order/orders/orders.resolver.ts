import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/dtos';
import { JwtVerifyGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { CART_ITEM_RELATIONS } from '@item/carts/constants';
import { CartsService } from '@item/carts/carts.service';
import { PRODUCT_RELATIONS } from '@item/products/constants';
import { ProductsService } from '@item/products/products.service';

import { OrderRelationType, ORDER_RELATIONS } from './constants';
import { RegisterOrderInput, RegisterOrderOutput } from './dtos';
import { Order } from './models';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;

  constructor(
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService
  ) {
    super();
  }

  @Mutation(() => RegisterOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async registerOrder(
    @CurrentUser() payload: JwtPayload,
    @Args('registerOrderInput')
    { cartItemIds, orderItemInputs }: RegisterOrderInput
  ): Promise<Order> {
    if (
      (!cartItemIds && !orderItemInputs) ||
      (cartItemIds && orderItemInputs)
    ) {
      throw new BadRequestException(
        'cartItemIds와 orderItemInputs중 하나만 제공되어야합니다.'
      );
    }

    if (cartItemIds) {
      const cartItemRelations = CART_ITEM_RELATIONS.filter(
        (relation) => relation !== 'user'
      );
      const cartItems = await this.cartsService.list(
        { idIn: cartItemIds },
        null,
        cartItemRelations
      );

      return await this.ordersService.register(payload.sub, cartItems);
    } else {
      const productIds = orderItemInputs.map((input) => input.productId);
      const productRelations = PRODUCT_RELATIONS.filter(
        (relation) =>
          relation !== 'item.detailImages' && relation !== 'item.options'
      );
      const products = await this.productsService.list(
        { idIn: productIds },
        null,
        productRelations
      );
      const inputs = products.map((product) => ({
        product,
        quantity: orderItemInputs.find(
          (orderItemInput) => orderItemInput.productId === product.id
        ).quantity,
      }));

      return await this.ordersService.register(payload.sub, inputs);
    }
  }
}
