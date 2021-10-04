import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IDigest } from '@content/digests/interfaces';
import { IProduct } from '@item/products/interfaces';
import { IUser } from '@user/users/interfaces';

import { ICartItem } from '../interfaces';

@ObjectType()
@Entity('cart_item')
@Index('idx-createdAt', ['createdAt'])
export class CartItemEntity extends BaseIdEntity implements ICartItem {
  constructor(attributes?: Partial<CartItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.product = attributes.product;
    this.productId = attributes.productId;
    this.user = attributes.user;
    this.userId = attributes.userId;

    this.recommendDigest = attributes.recommendDigest;
    this.recommendDigestId = attributes.recommendDigestId;

    this.quantity = attributes.quantity;
  }

  @ManyToOne('ProductEntity', { onDelete: 'CASCADE' })
  product: IProduct;
  @Field(() => Int)
  @Column()
  productId: number;
  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  user: IUser;
  @Field(() => Int)
  @Column()
  userId: number;

  @ManyToOne('DigestEntity', { onDelete: 'SET NULL', nullable: true })
  recommendDigest: IDigest;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  recommendDigestId: number;

  @Field(() => Int)
  @Column({ type: 'smallint', unsigned: true, default: 0 })
  quantity: number;
}
