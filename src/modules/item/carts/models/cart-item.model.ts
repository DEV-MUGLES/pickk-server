import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Digest } from '@content/digests/models';
import { Product } from '@item/products/models';
import { User } from '@user/users/models';

import { CartItemEntity } from '../entities';

@ObjectType()
export class CartItem extends CartItemEntity {
  @Field(() => Product)
  @Type(() => Product)
  product: Product;
  @Field(() => User)
  @Type(() => User)
  user: User;
  @Field(() => Digest, { nullable: true })
  @Type(() => Digest)
  recommendDigest: Digest;

  @Field({ description: '[MODEL ONLY]', nullable: true })
  isAdjusted: boolean;

  /** 이 CartItem의 quantity가 재고를 넘지 않도록 조정합니다. 
   - @returns 조정 수행 여부 */
  adjustQuantityToStock(): boolean {
    const { item, stockThreshold } = this.product;

    if (!item.isInfiniteStock && stockThreshold < this.quantity) {
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
