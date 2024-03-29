import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsString } from 'class-validator';

import { IAccount } from '@common/interfaces';

import { IOrderItem } from '@order/order-items/interfaces';
import { IRefundRequest } from '@order/refund-requests/interfaces';
import { PayMethod } from '@payment/payments/constants';
import { IUser } from '@user/users/interfaces';

import { OrderStatus } from '../constants';
import {
  IOrder,
  IOrderBuyer,
  IOrderReceiver,
  IOrderVbankReceipt,
} from '../interfaces';

import { OrderVbankReceiptEntity } from './order-vbank-receipt.entity';
import { OrderBuyerEntity } from './order-buyer.entity';
import { OrderReceiverEntity } from './order-receiver.entity';
import { OrderRefundAccountEntity } from './order-refund-acocunt.entity';

@ObjectType()
@Entity({ name: 'order' })
export class OrderEntity implements IOrder {
  constructor(attributes?: Partial<OrderEntity>) {
    if (!attributes) {
      return;
    }

    this.merchantUid = attributes.merchantUid;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.orderItems = attributes.orderItems;

    this.refundRequests = attributes.refundRequests;

    this.status = attributes.status;
    this.payMethod = attributes.payMethod;

    this.vbankReceipt = attributes.vbankReceipt;
    this.buyer = attributes.buyer;
    this.receiver = attributes.receiver;
    this.refundAccount = attributes.refundAccount;

    this.payingAt = attributes.payingAt;
    this.failedAt = attributes.failedAt;
    this.vbankReadyAt = attributes.vbankReadyAt;
    this.vbankDodgedAt = attributes.vbankDodgedAt;
    this.paidAt = attributes.paidAt;
  }
  @Field(() => String, {
    description: '(PK) 주문고유번호. YYMMDDHHmmssSSS + NN(00~99)',
  })
  @PrimaryColumn({ type: 'char', length: 20 })
  @IsString()
  merchantUid: string;
  @Field()
  @CreateDateColumn()
  createdAt: Date;
  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('UserEntity', { nullable: true })
  user?: IUser;
  @Field(() => Int, { nullable: true })
  @Column()
  userId?: number;

  @OneToMany('OrderItemEntity', 'order', { cascade: true })
  orderItems: IOrderItem[];
  @OneToMany('RefundRequestEntity', 'order', { cascade: true })
  refundRequests: IRefundRequest[];

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @Field(() => PayMethod, { nullable: true })
  @Column({ type: 'enum', enum: PayMethod, nullable: true })
  @IsEnum(PayMethod)
  payMethod?: PayMethod;

  @OneToOne(() => OrderVbankReceiptEntity, { cascade: true, nullable: true })
  @JoinColumn()
  vbankReceipt?: IOrderVbankReceipt;

  @OneToOne(() => OrderBuyerEntity, { cascade: true, nullable: true })
  @JoinColumn()
  buyer: IOrderBuyer;
  @OneToOne(() => OrderReceiverEntity, { cascade: true, nullable: true })
  @JoinColumn()
  receiver: IOrderReceiver;
  @OneToOne(() => OrderRefundAccountEntity, { cascade: true, nullable: true })
  @JoinColumn()
  refundAccount: IAccount;

  @Field({ nullable: true })
  @Column({ nullable: true })
  payingAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  failedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  vbankReadyAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  vbankDodgedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  paidAt?: Date;
}
