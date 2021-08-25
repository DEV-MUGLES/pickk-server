import { Field, ObjectType } from '@nestjs/graphql';

import { Item } from '@item/items/models';

import { ProductEntity } from '../entities';
import { NotEnoughStockException } from '../exceptions';

@ObjectType()
export class Product extends ProductEntity {
  @Field(() => Item)
  item: Item;

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
