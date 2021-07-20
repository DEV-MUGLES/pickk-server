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
  @Field()
  @Column()
  due: Date;
}
