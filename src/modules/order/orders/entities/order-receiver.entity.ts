import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsNumberString,
  IsOptional,
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

    this.name = attributes.name;
    this.phoneNumber = attributes.phoneNumber;
    this.message = attributes.message;
  }

  @Field()
  @Column({
    type: 'varchar',
    length: 15,
  })
  @IsString()
  name: string;

  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;

  @Field({ description: '베송 요청사항 (최대 50자)', nullable: true })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  message: string;
}
