import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsNumberString, IsOptional, IsPhoneNumber } from 'class-validator';

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
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  receiverName: string;

  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber1: string;

  @Field({ nullable: true })
  @Column({ type: 'char', length: 11, nullable: true })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @IsOptional()
  phoneNumber2?: string;

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
