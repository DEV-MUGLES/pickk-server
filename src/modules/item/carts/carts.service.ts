import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis/provider.service';

import {
  CartItemFilter,
  CreateCartItemInput,
  UpdateCartItemInput,
} from './dtos';
import { Cart, CartItem } from './models';
import { CartItemsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartItemsRepository)
    private readonly cartItemsRepository: CartItemsRepository,
    @Inject(CacheService) private cacheService: CacheService
  ) {}

  async list(
    cartItemFilter?: CartItemFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<CartItem[]> {
    const _productFilter = plainToClass(CartItemFilter, cartItemFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.cartItemsRepository.entityToModelMany(
      await this.cartItemsRepository.find({
        relations,
        where: parseFilter(_productFilter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async countItems(userId: number): Promise<number> {
    const cacheKey = CartItem.getCountCacheKey(userId);
    const cached = await this.cacheService.get<number>(cacheKey);

    if (cached) {
      return Number(cached);
    }

    return await this.reloadItemsCount(userId);
  }

  async reloadItemsCount(userId: number): Promise<number> {
    const cacheKey = CartItem.getCountCacheKey(userId);
    const count = await this.cartItemsRepository.countByUserId(userId);
    this.cacheService.set<number>(cacheKey, count);
    return count;
  }

  async createCartItem(
    userId: number,
    createCartItemInput: CreateCartItemInput
  ): Promise<CartItem> {
    const existing = await this.cartItemsRepository.findOneEntity({
      userId,
      productId: createCartItemInput.productId,
    });

    const cartItem = await this.cartItemsRepository.save(
      new CartItem({ ...existing, userId, ...createCartItemInput })
    );

    await this.reloadItemsCount(userId);
    return cartItem;
  }

  async getItem(id: number, relations: string[] = []): Promise<CartItem> {
    return await this.cartItemsRepository.get(id, relations);
  }

  async updateItem(
    cartItem: CartItem,
    updateCartItemInput: UpdateCartItemInput
  ): Promise<CartItem> {
    return await this.cartItemsRepository.save(
      new CartItem({
        ...cartItem,
        ...updateCartItemInput,
      })
    );
  }

  async findItemsByUserId(userId: number): Promise<CartItem[]> {
    return await this.list({ userId }, null, [
      'product',
      'product.shippingReservePolicy',
      'product.itemOptionValues',
      'product.item',
      'product.item.prices',
      'product.item.brand',
      'product.item.brand.seller',
      'product.item.brand.seller.shippingPolicy',
    ]);
  }

  async adjustQuantitiesToStock(cartItems: CartItem[]): Promise<CartItem[]> {
    const adjustedCartItems = cartItems.filter((cartItem) =>
      cartItem.adjustQuantityToStock()
    );
    return this.cartItemsRepository.save(adjustedCartItems);
  }

  createCart(userId: number, cartItems: CartItem[]): Cart {
    return Cart.create(userId, cartItems);
  }

  /** 입력된 ids가 모두 입력된 cartItems들과 매칭되는 경우 true를 반환합니다. */
  checkIdsIncludedToItems(ids: number[], cartItems: CartItem[]): boolean {
    return ids.every(
      (id) => cartItems.findIndex((cartItem) => cartItem.id === id) >= 0
    );
  }

  async removeItemsByIds(ids: number[], userId: number): Promise<void> {
    await this.cartItemsRepository.bulkDelete(ids);

    await this.reloadItemsCount(userId);
  }
}
