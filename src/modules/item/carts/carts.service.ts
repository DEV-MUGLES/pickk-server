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
}
