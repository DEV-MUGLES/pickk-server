import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Column,
  ManyToOne,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { IsEnum, IsString, Min } from 'class-validator';

import { Product } from '@item/products/models';
import { Seller } from '@item/sellers/models';
import { IOrderItem } from '@order/order-items/interfaces';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';
import { Shipment } from '@order/shipments/models';
import { User } from '@user/users/models';

import { ExchangeRequestStatus } from '../constants';
import { IExchangeRequest } from '../interfaces';

@ObjectType()
@Entity({ name: 'exchange_request' })
export class ExchangeRequestEntity implements IExchangeRequest {
  constructor(attributes?: Partial<ExchangeRequestEntity>) {
    if (!attributes) {
      return;
    }

    this.merchantUid = attributes.merchantUid;

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.product = attributes.product;
    this.productId = attributes.productId;
    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.pickShipment = attributes.pickShipment;
    this.pickShipmentId = attributes.pickShipmentId;
    this.reShipment = attributes.reShipment;
    this.reShipmentId = attributes.reShipmentId;

    this.orderItem = attributes.orderItem;
    this.orderItemMerchantUid = attributes.orderItemMerchantUid;

    this.status = attributes.status;
    this.faultOf = attributes.faultOf;
    this.reason = attributes.reason;
    this.rejectReason = attributes.rejectReason;

    this.shippingFee = attributes.shippingFee;

    this.quantity = attributes.quantity;
    this.itemName = attributes.itemName;
    this.productVariantName = attributes.productVariantName;

    this.isSettled = attributes.isSettled;
    this.isProcessDelaying = attributes.isProcessDelaying;
    this.processDelayedAt = attributes.processDelayedAt;

    this.requestedAt = attributes.requestedAt;
    this.pickedAt = attributes.pickedAt;
    this.rejectedAt = attributes.rejectedAt;
    this.confirmedAt = attributes.confirmedAt;

    this.settledAt = attributes.settledAt;
  }

  @Field({ description: 'orderItemMerchantUid와 동일' })
  @PrimaryColumn({ type: 'char', length: 22 })
  @IsString()
  merchantUid: string;

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { onDelete: 'SET NULL', nullable: true })
  user?: User;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userId?: number;
  @Field(() => Product, { nullable: true })
  @ManyToOne('ProductEntity', { onDelete: 'SET NULL', nullable: true })
  product?: Product;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  productId: number;
  @Field(() => Seller, { nullable: true })
  @ManyToOne('SellerEntity', { onDelete: 'SET NULL', nullable: true })
  seller?: Seller;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  sellerId?: number;

  @Field(() => Shipment, { nullable: true })
  @ManyToOne('ShipmentEntity', {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  pickShipment: Shipment;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  pickShipmentId: number;

  @Field(() => Shipment, { nullable: true })
  @ManyToOne('ShipmentEntity', {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  reShipment: Shipment;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  reShipmentId: number;

  @OneToOne('OrderItemEntity', 'refundRequests', { cascade: ['update'] })
  @JoinColumn()
  orderItem: IOrderItem;
  @Field()
  @Column({ type: 'char', length: 20 })
  orderItemMerchantUid: string;

  @Field(() => ExchangeRequestStatus)
  @Column({ type: 'enum', enum: ExchangeRequestStatus })
  @IsEnum(ExchangeRequestStatus)
  status: ExchangeRequestStatus;

  @Field(() => OrderClaimFaultOf)
  @Column({ type: 'enum', enum: OrderClaimFaultOf })
  @IsEnum(OrderClaimFaultOf)
  faultOf: OrderClaimFaultOf;

  @Field({ description: '255자 이내로 적어주세요' })
  @Column()
  reason: string;
  @Field({ description: '255자 이내로 적어주세요', nullable: true })
  @Column({ nullable: true })
  rejectReason: string;
  @Field(() => Int, { description: '결제된 교환 배송비' })
  @Column({ type: 'mediumint', unsigned: true })
  @Min(1)
  shippingFee: number;

  @Field(() => Int)
  @Column({ type: 'smallint', unsigned: true })
  @Min(1)
  quantity: number;
  @Field()
  @Column()
  @IsString()
  itemName: string;
  @Field()
  @Column()
  @IsString()
  productVariantName: string;

  @Field()
  @Column({ default: false })
  isSettled: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
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
  reshippingAt: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  reshippedAt: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  rejectedAt: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  confirmedAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  settledAt: Date;
}
