import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { AbstractAddressEntity } from '@common/entities';

import { IOrderReceiver } from '../interfaces';

@ObjectType()
@Entity({ name: 'order_receiver' })
export class OrderReceiverEntity
  extends AbstractAddressEntity
  implements IOrderReceiver
{
  constructor(attributes?: Partial<OrderReceiverEntity>) {
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
