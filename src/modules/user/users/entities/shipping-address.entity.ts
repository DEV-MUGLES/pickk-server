import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractAddressEntity } from '@common/entities';

import { IShippingAddress } from '../interfaces';

import { UserEntity } from './user.entity';

@ObjectType()
@Entity({
  name: 'shipping_address',
})
export class ShippingAddressEntity
  extends AbstractAddressEntity
  implements IShippingAddress
{
  constructor(attributes?: Partial<ShippingAddressEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.isPrimary = attributes.isPrimary;

    this.user = attributes.user;
    this.userId = attributes.userId;
  }

  @Field()
  @Column()
  isPrimary: boolean;

  @ManyToOne('UserEntity', 'shippingAddresses', {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @Field(() => Int)
  @Column({ nullable: true })
  userId: number;
}
