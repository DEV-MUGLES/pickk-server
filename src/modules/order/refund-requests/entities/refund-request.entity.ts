import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';

import { Seller } from '@item/sellers/models';
import { IOrderItem } from '@order/order-items/interfaces';
import { IOrder } from '@order/orders/interfaces';
import { Shipment } from '@order/shipments/models';
import { User } from '@user/users/models';

import { OrderClaimFaultOf, RefundRequestStatus } from '../constants';
import { IRefundRequest } from '../interfaces';

@ObjectType()
@Entity({ name: 'refund_request' })
export class RefundRequestEntity implements IRefundRequest {
  constructor(attributes?: Partial<RefundRequestEntity>) {
    if (!attributes) {
      return;
    }

    this.merchantUid = attributes.merchantUid;

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;
    this.user = attributes.user;
    this.userId = attributes.userId;

    this.shipment = attributes.shipment;
    this.shipmentId = attributes.shipmentId;

    this.order = attributes.order;
    this.orderMerchantUid = attributes.orderMerchantUid;
    this.orderItems = attributes.orderItems;

    this.status = attributes.status;
    this.faultOf = attributes.faultOf;
    this.reason = attributes.reason;
    this.amount = attributes.amount;
    this.shippingFee = attributes.shippingFee;
    this.rejectReason = attributes.rejectReason;

    this.isProcessDelaying = attributes.isProcessDelaying;

    this.processDelayedAt = attributes.processDelayedAt;

    this.requestedAt = attributes.requestedAt;
    this.pickedAt = attributes.pickedAt;
    this.rejectedAt = attributes.rejectedAt;
    this.confirmedAt = attributes.confirmedAt;
  }

  @Field(() => String, { description: '(PK) YYMMDDHHmmssSSS + NN(00~99) + M' })
  @PrimaryColumn({ type: 'char', length: 20 })
  @IsString()
  merchantUid: string;

  @Field(() => Seller, { nullable: true })
  @ManyToOne('SellerEntity', { nullable: true })
  seller?: Seller;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  sellerId?: number;
  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user?: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId?: number;
  @Field(() => Shipment, { nullable: true })
  @OneToOne('ShipmentEntity', { nullable: true, cascade: true })
  @JoinColumn()
  shipment: Shipment;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  shipmentId: number;

  @ManyToOne('OrderEntity', 'refundRequests')
  order: IOrder;
  @Field()
  @Column({ type: 'char', length: 20 })
  orderMerchantUid: string;
  @OneToMany('OrderItemEntity', 'refundRequest', { cascade: true })
  orderItems: IOrderItem[];

  @Field(() => RefundRequestStatus)
  @Column({ type: 'enum', enum: RefundRequestStatus })
  @IsEnum(RefundRequestStatus)
  status: RefundRequestStatus;

  @Field(() => OrderClaimFaultOf)
  @Column({ type: 'enum', enum: OrderClaimFaultOf })
  @IsEnum(OrderClaimFaultOf)
  faultOf: OrderClaimFaultOf;

  @Field({ description: '255자 이내로 적어주세요' })
  @Column()
  @IsString()
  reason: string;
  @Field(() => Int)
  @Column({ unsigned: true, default: 0 })
  @Min(0)
  amount: number;
  @Field(() => Int, { description: '부과된 반품 배송비' })
  @Column({ type: 'mediumint', unsigned: true })
  @Min(1)
  shippingFee: number;
  @Field({ description: '255자 이내로 적어주세요', nullable: true })
  @Column({ nullable: true })
  @IsString()
  rejectReason: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  @IsOptional()
  isProcessDelaying: boolean;
  @Field()
  @Column({ nullable: true })
  processDelayedAt: Date;

  @Field()
  @CreateDateColumn()
  requestedAt: Date;
  @Field({ nullable: true, description: '수거 완료 시점' })
  @Column({ nullable: true })
  pickedAt: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  rejectedAt: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  confirmedAt: Date;
}
