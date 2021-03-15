import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractAddressEntity } from '@src/common/entities/address.entity';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity({
  name: 'shipping_address',
})
export class ShippingAddressEntity extends AbstractAddressEntity {
  @Field()
  @Column()
  isPrimary: boolean;

  @ManyToOne('UserEntity', 'shippingAddresses')
  user: UserEntity;
}
