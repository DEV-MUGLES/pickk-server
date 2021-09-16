import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';
import { IsEmail, IsNumberString, IsPhoneNumber } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IOrder, IOrderBuyer } from '../interfaces';

@ObjectType()
@Entity({ name: 'order_buyer' })
export class OrderBuyerEntity extends BaseIdEntity implements IOrderBuyer {
  constructor(attributes?: Partial<OrderBuyerEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.order = attributes.order;

    this.name = attributes.name;
    this.email = attributes.email;
    this.phoneNumber = attributes.phoneNumber;
  }

  @OneToOne('OrderEntity', 'buyer', { onDelete: 'CASCADE' })
  order: IOrder;

  @Field()
  @Column({ length: 15 })
  name: string;
  @Field()
  @Column()
  @IsEmail()
  email: string;
  @Field()
  @Column({ type: 'char', length: 12 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;
}
