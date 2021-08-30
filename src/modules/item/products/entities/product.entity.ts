import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { IItem } from '@item/items/interfaces';
import { ItemOptionValueEntity } from '@item/items/entities';
// @BARREL
import { ItemOptionValue } from '@item/items/models/item-option-value.model';

import { IProduct } from '../interfaces';

import { ProductShippingReservePolicy } from '../models/product-shipping-reserve-policy.model';
import { ProductShippingReservePolicyEntity } from './product-shipping-reserve-policy.entity';

@ObjectType()
@Entity({
  name: 'product',
})
export class ProductEntity extends BaseIdEntity implements IProduct {
  constructor(attributes?: Partial<ProductEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.stock = attributes.stock;
    this.priceVariant = attributes.priceVariant;
    this.item = attributes.item;
    this.itemOptionValues = attributes.itemOptionValues;
    this.shippingReservePolicy = attributes.shippingReservePolicy;
  }

  @Field(() => Int)
  @Column({
    type: 'smallint',
    unsigned: true,
    default: 0,
  })
  stock: number;
  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  priceVariant: number;

  @ManyToOne('ItemEntity', 'products', {
    onDelete: 'CASCADE',
  })
  item: IItem;

  @Field(() => Int)
  @Column()
  itemId: number;

  @Field(() => [ItemOptionValue])
  @ManyToMany(() => ItemOptionValueEntity)
  @JoinTable()
  itemOptionValues: ItemOptionValue[];

  @Field(() => ProductShippingReservePolicy, {
    nullable: true,
  })
  @OneToOne(() => ProductShippingReservePolicyEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  shippingReservePolicy: ProductShippingReservePolicy;

  @Field({
    description:
      '이 Product의 stock이 0이면 예약배송정책의 stock을 반환합니다.',
  })
  get stockThreshold(): number {
    return this.stock || this.shippingReservePolicy?.stock || 0;
  }

  @Field({ description: '예약배송 적용 여부' })
  get isShipReserving(): boolean {
    if (!this.shippingReservePolicy) {
      return false;
    }
    return this.stock === 0 && this.shippingReservePolicy.stock > 0;
  }
}
