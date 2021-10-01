import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Item } from '@item/items/models';

import { ProductEntity } from '../entities';
import { NotEnoughStockException } from '../exceptions';

import { ProductShippingReservePolicy } from './product-shipping-reserve-policy.model';

@ObjectType()
export class Product extends ProductEntity {
  @Field(() => Item)
  @Type(() => Item)
  item: Item;

  @Field(() => ProductShippingReservePolicy, { nullable: true })
  @Type(() => ProductShippingReservePolicy)
  shippingReservePolicy: ProductShippingReservePolicy;

  @Field({ description: '[MODEL ONLY] 예약배송 적용 여부' })
  get isShipReserving(): boolean {
    if (!this.shippingReservePolicy) {
      return false;
    }
    return this.stock === 0 && this.shippingReservePolicy.stock > 0;
  }
  @Field({ description: '[MODEL ONLY] item.finalPrice + priceVariant' })
  get purchasePrice(): number {
    if (!this.item?.finalPrice) {
      return 0;
    }
    return this.item.finalPrice + this.priceVariant;
  }

  public destock(quantity: number): void {
    if (this.stockThreshold < quantity) {
      throw new NotEnoughStockException(this, quantity);
    }

    if (this.stock >= quantity) {
      this.stock -= quantity;
    } else {
      this.shippingReservePolicy.stock -= quantity;
    }
  }

  public restock(quantity: number, isShipReserved: boolean): void {
    if (isShipReserved) {
      this.shippingReservePolicy.stock += quantity;
    } else {
      this.stock += quantity;
    }
  }
}
