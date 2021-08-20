import { Field, ObjectType } from '@nestjs/graphql';

import { CartItemEntity } from '../entities';

@ObjectType()
export class CartItem extends CartItemEntity {
  @Field({ defaultValue: false })
  isAdjusted: boolean;

  /** 이 CartItem의 quantity가 재고를 넘지 않도록 조정합니다. 
   - @returns 조정 수행 여부 */
  adjustQuantityToStock(): boolean {
    const { stockThreshold } = this.product;

    if (stockThreshold < this.quantity) {
      this.quantity = stockThreshold;
      this.isAdjusted = true;
    }

    return this.isAdjusted || false;
  }

  public static getCountCacheKey(userId: number): string {
    return `cart-items-count:${userId}`;
  }
}
