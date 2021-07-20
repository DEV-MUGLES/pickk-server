import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsEnum, IsString, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { IOrderItem } from '@order/order-items/interfaces';
import { User } from '@user/users/models';

import { OrderStatus, PayMethod } from '../constants';
import { IOrder } from '../interfaces';

import { OrderBuyer } from '../models/order-buyer.model';
import { OrderReceiver } from '../models/order-receiver.model';
import { OrderVbankReceipt } from '../models/order-vbank-receipt.model';
import {
  OrderVbankReceiptEntity,
  OrderBuyerEntity,
  OrderReceiverEntity,
} from '.';

@ObjectType()
@Entity({ name: 'order' })
export class OrderEntity extends BaseIdEntity implements IOrder {
  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user?: User;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  userId?: number;

  @OneToMany('OrderItemEntity', 'order', { cascade: true, onDelete: 'CASCADE' })
  orderItems: IOrderItem[];

  @Column()
  @IsString()
  merchantUid: string;

  @Field(() => OrderStatus)
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field(() => OrderStatus)
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  payMethod: PayMethod;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  totalItemFinalPrice: number;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(0)
  totalShippingFee: number;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(0)
  totalCouponDiscountAmount: number;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(0)
  totalUsedPointAmount: number;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  totalPayAmount: number;

  @Field(() => OrderVbankReceipt, {
    nullable: true,
  })
  @OneToOne(() => OrderVbankReceiptEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  vbankInfo?: OrderVbankReceipt;

  @Field(() => OrderBuyer)
  @OneToOne(() => OrderBuyerEntity, {
    cascade: true,
  })
  @JoinColumn()
  buyer: OrderBuyer;

  @Field(() => OrderReceiver)
  @OneToOne(() => OrderReceiverEntity, {
    cascade: true,
  })
  @JoinColumn()
  receiver: OrderReceiver;

  @Field({ nullable: true })
  @Column({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  withdrawnAt?: Date;
}
