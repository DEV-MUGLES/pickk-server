import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { IProduct } from '../interfaces/product.interface';
import { ItemEntity } from '../../items/entities/item.entity';
import { ItemOptionValue } from '../../items/models/item-option-value.model';
import { ItemOptionValueEntity } from '../../items/entities/item-option-value.entity';
import { ProductShippingReservePolicyEntity } from './product-shipping-reserve-policy.entity';
import { ProductShippingReservePolicy } from '../models/product-shipping-reserve-policy.model';

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

  @ManyToOne('ItemEntity', 'products', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;

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
}
