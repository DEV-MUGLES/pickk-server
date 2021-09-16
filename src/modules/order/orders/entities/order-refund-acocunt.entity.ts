import { ObjectType } from '@nestjs/graphql';
import { Entity, OneToOne } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

import { IOrder } from '../interfaces';

@ObjectType()
@Entity({ name: 'order_refund_account' })
export class OrderRefundAccountEntity extends AbstractAccountEntity {
  @OneToOne('OrderEntity', 'refundAccount', { onDelete: 'CASCADE' })
  order: IOrder;
}
