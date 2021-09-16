import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

import { AbstractAddressEntity } from '@common/entities';

import { IOrder, IOrderReceiver } from '../interfaces';

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

    this.order = attributes.order;

    this.message = attributes.message;
  }

  @OneToOne('OrderEntity', 'receiver', { onDelete: 'CASCADE' })
  order: IOrder;

  @Field({ description: '베송 요청사항 (최대 50자)', nullable: true })
  @Column({ length: 50, nullable: true })
  @IsString()
  @IsOptional()
  message: string;
}
