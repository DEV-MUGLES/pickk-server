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

import { IOrderItem } from '@order/order-items/interfaces';
import { IRefundRequest } from '@order/refund-requests/interfaces';
import { PayMethod } from '@payment/payments/constants';
import { User } from '@user/users/models';

import { OrderStatus } from '../constants';
import { IOrder } from '../interfaces';

import { OrderBuyer } from '../models/order-buyer.model';
import { OrderReceiver } from '../models/order-receiver.model';
import { OrderRefundAccount } from '../models/order-refund-account.model';
import { OrderVbankReceipt } from '../models/order-vbank-receipt.model';

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

    this.vbankInfo = attributes.vbankInfo;
    this.buyer = attributes.buyer;
    this.receiver = attributes.receiver;
    this.refundAccount = attributes.refundAccount;

    this.payingAt = attributes.payingAt;
    this.failedAt = attributes.failedAt;
    this.vbankReadyAt = attributes.vbankReadyAt;
    this.vbankDodgedAt = attributes.vbankDodgedAt;
    this.paidAt = attributes.paidAt;
    this.withdrawnAt = attributes.withdrawnAt;
  }
  @Field(() => String, {
    description:
      '주문고유번호. PrimaryColumn입니다. YYMMDDHHmmssSSS + NN(00~99) 형식입니다.',
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

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user?: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId?: number;

  @OneToMany('OrderItemEntity', 'order', { cascade: true, onDelete: 'CASCADE' })
  orderItems: IOrderItem[];
  @OneToMany('RefundRequestEntity', 'order', {
    cascade: true,
    onDelete: 'CASCADE',
  })
  refundRequests: IRefundRequest[];

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @Field(() => PayMethod, { nullable: true })
  @Column({ type: 'enum', enum: PayMethod, nullable: true })
  @IsEnum(PayMethod)
  payMethod?: PayMethod;

  @Field(() => OrderVbankReceipt, { nullable: true })
  @OneToOne(() => OrderVbankReceiptEntity, { cascade: true, nullable: true })
  @JoinColumn()
  vbankInfo?: OrderVbankReceipt;

  @Field(() => OrderBuyer, { nullable: true })
  @OneToOne(() => OrderBuyerEntity, { cascade: true, nullable: true })
  @JoinColumn()
  buyer: OrderBuyer;
  @Field(() => OrderReceiver, { nullable: true })
  @OneToOne(() => OrderReceiverEntity, { cascade: true, nullable: true })
  @JoinColumn()
  receiver: OrderReceiver;
  @Field(() => OrderRefundAccount, { nullable: true })
  @OneToOne(() => OrderRefundAccountEntity, { cascade: true, nullable: true })
  @JoinColumn()
  refundAccount: OrderRefundAccount;

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
  @Field({ nullable: true })
  @Column({ nullable: true })
  withdrawnAt?: Date;
}
