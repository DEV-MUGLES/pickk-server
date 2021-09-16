import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

import { IOrder, IOrderVbankReceipt } from '../interfaces';

@ObjectType()
@Entity({ name: 'order_vbank_receipt' })
export class OrderVbankReceiptEntity
  extends AbstractAccountEntity
  implements IOrderVbankReceipt
{
  constructor(attributes?: Partial<OrderVbankReceiptEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.due = attributes.due;
  }

  @OneToOne('OrderEntity', 'vbankReceipt', { onDelete: 'CASCADE' })
  order: IOrder;

  @Field()
  @Column()
  due: Date;
}
