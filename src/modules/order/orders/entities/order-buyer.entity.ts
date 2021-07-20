import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IOrderBuyer } from '../interfaces';

@ObjectType()
@Entity({ name: 'order_buyer' })
export class OrderBuyerEntity extends BaseIdEntity implements IOrderBuyer {
  constructor(attributes?: Partial<OrderBuyerEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
  }

  @Field()
  @Column({
    type: 'varchar',
    length: 15,
  })
  @IsString()
  name: string;

  @Field()
  @Column()
  @IsEmail()
  email: string;

  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;
}
