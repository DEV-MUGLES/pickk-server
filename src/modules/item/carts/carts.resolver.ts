import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

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

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async removeMyCartItems(
    @CurrentUser() payload: JwtPayload,
    @Args('ids', { type: () => [Int] }) ids: number[]
  ): Promise<boolean> {
    const userId = payload.sub;
    const cartItems = await this.cartsService.findItemsByUserId(userId);
    if (this.cartsService.checkIdsIncludedToItems(ids, cartItems)) {
      throw new UnauthorizedException(
        '본인의 것이 아닌 CartItem이 포함되었습니다.'
      );
    }
    await this.cartsService.removeItemsByIds(ids);
    return true;
  }
}
