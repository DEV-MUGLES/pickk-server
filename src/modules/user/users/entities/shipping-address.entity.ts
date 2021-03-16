import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { AbstractAddressEntity } from '@src/common/entities/address.entity';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity({
  name: 'shipping_address',
})
@Index(['userId', 'name'], { unique: true })
export class ShippingAddressEntity extends AbstractAddressEntity {
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
