import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

import { IOrderVbankReceipt } from '../interfaces';

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

  @Field()
  @Column()
  due: Date;
}
