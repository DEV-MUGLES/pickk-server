import {
  ConflictException,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtVerifyGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import {
  CartItemRelationType,
  CART_ITEM_RELATIONS,
} from './constants/cart-item.relation';
import {
  CreateCartItemInput,
  UpdateCartItemInput,
} from './dtos/cart-item.input';
import { CartItem, Cart } from './models';
import { CartsService } from './carts.service';

@Resolver(() => CartItem)
export class CartsResolver extends BaseResolver<CartItemRelationType> {
  relations = CART_ITEM_RELATIONS;
  derivedFieldsInfo = {
    'product.item.prices': ['originalPrice', 'sellPrice', 'finalPrice'],
  };

  constructor(@Inject(CartsService) private cartsService: CartsService) {
    super();
  }

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

    return this.cartsService.createCart(userId, cartItems);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async removeMyCartItems(
    @CurrentUser() payload: JwtPayload,
    @Args('ids', { type: () => [Int] }) ids: number[]
  ): Promise<boolean> {
    const userId = payload.sub;
    const cartItems = await this.cartsService.findItemsByUserId(userId);
    if (!this.cartsService.checkIdsIncludedToItems(ids, cartItems)) {
      throw new UnauthorizedException(
        '본인의 것이 아니거나 존재하지 않는 CartItem이 포함되었습니다.'
      );
    }
    await this.cartsService.removeItemsByIds(ids, userId);
    return true;
  }

  @Mutation(() => CartItem)
  @UseGuards(JwtVerifyGuard)
  async createMyCartItem(
    @CurrentUser() payload: JwtPayload,
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<CartItem> {
    const userId = payload.sub;
    const { productId } = createCartItemInput;
    if (await this.cartsService.checkCartItemExist(userId, productId)) {
      throw new ConflictException('해당 Product가 이미 담겨있습니다.');
    }

    const cartItem = await this.cartsService.createCartItem(
      userId,
      createCartItemInput
    );

    return await this.cartsService.getItem(
      cartItem.id,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => CartItem)
  @UseGuards(JwtVerifyGuard)
  async updateMyCartItem(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number,
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<CartItem> {
    const cartItem = await this.cartsService.getItem(id);
    if (cartItem.userId !== payload.sub) {
      throw new UnauthorizedException('본인의 CartItem만 수정할 수 있습니다.');
    }

    await this.cartsService.updateItem(cartItem, updateCartItemInput);
    return await this.cartsService.getItem(id, this.getRelationsFromInfo(info));
  }
}
