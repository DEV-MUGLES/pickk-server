import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CartItemsRepository } from './carts.repository';
import { Cart, CartItem } from './models';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartItemsRepository)
    private readonly cartItemsRepository: CartItemsRepository
  ) {}

  async countItemsByUserId(userId: number): Promise<number> {
    return await this.cartItemsRepository.countByUserId(userId);
  }

  async findItemsByUserId(userId: number): Promise<CartItem[]> {
    return this.cartItemsRepository.entityToModelMany(
      await this.cartItemsRepository.find({
        where: {
          userId,
        },
        relations: [
          'product',
          'product.itemOptionValues',
          'product.item',
          'product.item.prices',
          'product.item.brand',
          'product.item.brand.seller',
          'product.item.brand.seller.shippingPolicy',
        ],
      })
    );
  }

  async adjustQuantitiesToStock(cartItems: CartItem[]): Promise<CartItem[]> {
    const adjustedCartItems = cartItems.filter((cartItem) =>
      cartItem.adjustQuantityToStock()
    );
    return this.cartItemsRepository.save(adjustedCartItems);
  }

  createCart(cartItems: CartItem[]): Cart {
    return Cart.create(cartItems);
  }

  /** 입력된 ids가 모두 입력된 cartItems들과 매칭되는 경우 true를 반환합니다. */
  checkIdsIncludedToItems(ids: number[], cartItems: CartItem[]): boolean {
    return ids.every(
      (id) => cartItems.findIndex((cartItem) => cartItem.id === id) > 0
    );
  }

  async removeItemsByIds(ids: number[]): Promise<void> {
    await this.cartItemsRepository.bulkDelete(ids);
  }
}
