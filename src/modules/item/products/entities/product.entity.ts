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
// @BARREL
import { ItemOptionValue } from '@item/items/models/item-option-value.model';

import { IProduct, IProductShippingReservePolicy } from '../interfaces';

@ObjectType()
@Entity({
  name: 'product',
})
export class ProductEntity extends BaseIdEntity implements IProduct {
  constructor(attributes?: Partial<ProductEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;
    this.itemOptionValues = attributes.itemOptionValues;

    this.shippingReservePolicy = attributes.shippingReservePolicy;

    this.stock = attributes.stock;
    this.priceVariant = attributes.priceVariant;

    this.isDeleted = attributes.isDeleted;
  }

  @ManyToOne('ItemEntity', 'products', { onDelete: 'CASCADE' })
  item: IItem;
  @Field(() => Int)
  @Column()
  itemId: number;
  @Field(() => [ItemOptionValue])
  @ManyToMany('ItemOptionValueEntity')
  @JoinTable()
  itemOptionValues: ItemOptionValue[];

  @OneToOne('ProductShippingReservePolicyEntity', {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  shippingReservePolicy: IProductShippingReservePolicy;

  @Field(() => Int)
  @Column({ type: 'smallint', unsigned: true, default: 0 })
  stock: number;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true })
  priceVariant: number;

  @Field()
  @Column({ default: false })
  isDeleted: boolean;

  @Field({
    description: '[MODEL ONLY] stock || shippingReservePolicy?.stock || 0',
  })
  get stockThreshold(): number {
    return this.stock || this.shippingReservePolicy?.stock || 0;
  }
}
