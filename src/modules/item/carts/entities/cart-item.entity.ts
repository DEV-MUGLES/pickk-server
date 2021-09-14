import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Type } from 'class-transformer';

import { BaseIdEntity } from '@common/entities';
import { Product } from '@item/products/models';
import { User } from '@user/users/models';

import { ICartItem } from '../interfaces';

@ObjectType()
@Entity('cart_item')
@Index('idx_createdAt', ['createdAt'])
export class CartItemEntity extends BaseIdEntity implements ICartItem {
  constructor(attributes?: Partial<CartItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.quantity = attributes.quantity;

    this.productId = attributes.productId;
    this.product = attributes.product;
    this.userId = attributes.userId;
    this.user = attributes.user;
  }

  @Field(() => Int)
  @Column({
    type: 'smallint',
    unsigned: true,
    default: 0,
  })
  quantity: number;

  @Field()
  @Column()
  productId: number;

  @Type(() => Product)
  @Field(() => Product)
  @ManyToOne('ProductEntity', 'products', {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  userId: number;

  @ManyToOne('UserEntity', 'users', {
    onDelete: 'CASCADE',
  })
  user: User;
}
