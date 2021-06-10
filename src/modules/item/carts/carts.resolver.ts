import { Inject, UseGuards } from '@nestjs/common';
import { Int, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtVerifyGuard } from '@auth/guards';

import { CartItem, Cart } from './models';
import { CartsService } from './carts.service';

@Resolver(() => CartItem)
export class CartsResolver {
  constructor(@Inject(CartsService) private cartsService: CartsService) {}

  @Query(() => Int)
  @UseGuards(JwtVerifyGuard)
  async myCartItemsCount(@CurrentUser() payload: JwtPayload): Promise<number> {
    const userId = payload.sub;
    return this.cartsService.countItemsByUserId(userId);
  }

  @Query(() => Cart)
  @UseGuards(JwtVerifyGuard)
  async myCart(@CurrentUser() payload: JwtPayload): Promise<Cart> {
    const userId = payload.sub;
    const cartItems = await this.cartsService.findItemsByUserId(userId);
    await this.cartsService.adjustQuantitiesToStock(cartItems);
    return this.cartsService.createCart(cartItems);
  }
}
