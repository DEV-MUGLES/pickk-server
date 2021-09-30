import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Product } from '@item/products/models';
import { User } from '@user/users/models';

import { CartItemEntity } from '../entities';

@ObjectType()
export class CartItem extends CartItemEntity {
  @Type(() => Product)
  @Field(() => Product)
  product: Product;
  @Type(() => User)
  @Field(() => User)
  user: User;

  @Field({ description: '[MODEL ONLY]' })
  isAdjusted: boolean;

  /** 이 CartItem의 quantity가 재고를 넘지 않도록 조정합니다. 
   - @returns 조정 수행 여부 */
  adjustQuantityToStock(): boolean {
    const { stockThreshold } = this.product;

    if (stockThreshold < this.quantity) {
      this.quantity = stockThreshold;
      this.isAdjusted = true;
    } else {
      this.isAdjusted = false;
    }

    return this.isAdjusted;
  }

  public static getCountCacheKey(userId: number): string {
    return `cart-items-count:${userId}`;
  }
}
