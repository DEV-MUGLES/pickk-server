import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { User } from '@user/users/models';

import { ICartItem } from '../interfaces/cart-item.interface';
import { Product } from '../../products/models/product.model';

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
