import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { IDigest } from '@content/digests/interfaces';
import { ICampaign } from '@item/campaigns/interfaces';
import { IItem } from '@item/items/interfaces';
import { IProduct } from '@item/products/interfaces';
import { ISeller } from '@item/sellers/interfaces';
import { Coupon } from '@order/coupons/models';
import { IExchangeRequest } from '@order/exchange-requests/interfaces';
import { IOrder } from '@order/orders/interfaces';
import { IRefundRequest } from '@order/refund-requests/interfaces';
import { IShipment } from '@order/shipments/interfaces';
import { IUser } from '@user/users/interfaces';

import {
  OrderItemStatus,
  OrderItemClaimStatus,
  getOrderItemClaimStatusDisplayName,
  getOrderItemStatusDisplayName,
} from '../constants';
import { IOrderItem } from '../interfaces';

@ObjectType()
@Entity({ name: 'order_item' })
export class OrderItemEntity implements IOrderItem {
  constructor(attributes?: Partial<OrderItemEntity>) {
    if (!attributes) {
      return;
    }

    this.merchantUid = attributes.merchantUid;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;
    this.item = attributes.item;
    this.itemId = attributes.itemId;
    this.product = attributes.product;
    this.productId = attributes.productId;
    this.usedCoupon = attributes.usedCoupon;
    this.usedCouponId = attributes.usedCouponId;

    this.campaign = attributes.campaign;
    this.campaignId = attributes.campaignId;

    this.order = attributes.order;
    this.orderMerchantUid = attributes.orderMerchantUid;

    this.shipment = attributes.shipment;
    this.shipmentId = attributes.shipmentId;
    this.refundRequest = attributes.refundRequest;
    this.exchangeRequest = attributes.exchangeRequest;

    this.status = attributes.status;
    this.claimStatus = attributes.claimStatus;
    this.quantity = attributes.quantity;

    this.isShipReserved = attributes.isShipReserved;
    this.isConfirmed = attributes.isConfirmed;
    this.isSettled = attributes.isSettled;
    this.isDelaying = attributes.isDelaying;
    this.isProcessDelaying = attributes.isProcessDelaying;
    this.isFreeShippingPackage = attributes.isFreeShippingPackage;

    this.itemSellPrice = attributes.itemSellPrice;
    this.itemFinalPrice = attributes.itemFinalPrice;
    this.shippingFee = attributes.shippingFee;
    this.couponDiscountAmount = attributes.couponDiscountAmount;
    this.usedPointAmount = attributes.usedPointAmount;

    this.brandNameKor = attributes.brandNameKor;
    this.itemName = attributes.itemName;
    this.productVariantName = attributes.productVariantName;

    this.recommenderId = attributes.recommenderId;
    this.recommenderNickname = attributes.recommenderNickname;
    this.recommendDigestId = attributes.recommendDigestId;

    this.failedAt = attributes.failedAt;
    this.vbankReadyAt = attributes.vbankReadyAt;
    this.vbankDodgedAt = attributes.vbankDodgedAt;
    this.paidAt = attributes.paidAt;
    this.shipReadyAt = attributes.shipReadyAt;
    this.shippingAt = attributes.shippingAt;
    this.shippedAt = attributes.shippedAt;

    this.cancelRequestedAt = attributes.cancelRequestedAt;
    this.cancelledAt = attributes.cancelledAt;
    this.exchangeRequestedAt = attributes.exchangeRequestedAt;
    this.exchangedAt = attributes.exchangedAt;
    this.refundRequestedAt = attributes.refundRequestedAt;
    this.refundedAt = attributes.refundedAt;

    this.delayedAt = attributes.delayedAt;
    this.delayedShipExpectedAt = attributes.delayedShipExpectedAt;

    this.processDelayedAt = attributes.processDelayedAt;

    this.shipReservedAt = attributes.shipReservedAt;
    this.confirmedAt = attributes.confirmedAt;
    this.shipReservedAt = attributes.shipReservedAt;
    this.confirmedAt = attributes.confirmedAt;
    this.settledAt = attributes.settledAt;
  }

  @Field({ description: 'order.merchantUid + 숫자 2자리' })
  @PrimaryColumn({ type: 'char', length: 22 })
  @IsString()
  merchantUid: string;
  @Field()
  @CreateDateColumn()
  createdAt: Date;
  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('UserEntity', { onDelete: 'SET NULL', nullable: true })
  user?: IUser;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userId?: number;
  @ManyToOne('SellerEntity', { onDelete: 'SET NULL', nullable: true })
  seller?: ISeller;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  sellerId?: number;
  @ManyToOne('ItemEntity', { onDelete: 'SET NULL', nullable: true })
  item?: IItem;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  itemId?: number;
  @ManyToOne('ProductEntity', { onDelete: 'SET NULL', nullable: true })
  product?: IProduct;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  productId: number;

  @ManyToOne('CampaignEntity', { onDelete: 'SET NULL', nullable: true })
  campaign: ICampaign;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  campaignId: number;

  @Field(() => Coupon, { nullable: true })
  @ManyToOne('CouponEntity', { onDelete: 'SET NULL', nullable: true })
  usedCoupon?: Coupon;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  usedCouponId?: number;
  @OneToOne('ShipmentEntity', {
    onDelete: 'SET NULL',
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  shipment: IShipment;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  shipmentId: number;

  @ManyToOne('OrderEntity', { onDelete: 'CASCADE' })
  order: IOrder;
  @Field()
  @Column({ type: 'char', length: 20 })
  orderMerchantUid: string;

  @ManyToOne('RefundRequestEntity', 'orderItems')
  refundRequest: IRefundRequest;
  @OneToOne('ExchangeRequestEntity', 'orderItem', {
    onDelete: 'SET NULL',
    cascade: true,
  })
  exchangeRequest: IExchangeRequest;

  @Field({ description: '프론트엔드를 위한 status/claimStatus 표시값입니다.' })
  get statusDisplayName(): string {
    return this.isConfirmed
      ? '구매 확정'
      : getOrderItemClaimStatusDisplayName(this.claimStatus) ??
          getOrderItemStatusDisplayName(this.status);
  }

  @Field(() => OrderItemStatus)
  @Column({ type: 'enum', enum: OrderItemStatus })
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;
  @Field(() => OrderItemClaimStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: OrderItemClaimStatus,
    nullable: true,
  })
  @IsEnum(OrderItemClaimStatus)
  @IsOptional()
  claimStatus?: OrderItemClaimStatus;
  @Field(() => Int)
  @Column({ type: 'smallint', unsigned: true })
  @Min(1)
  quantity: number;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isConfirmed: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isShipReserved: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isSettled: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isDelaying: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isProcessDelaying: boolean;
  @Field()
  @Column()
  isFreeShippingPackage: boolean;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  itemSellPrice: number;
  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  itemFinalPrice: number;
  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  shippingFee: number;
  @Field(() => Int)
  @Column({ unsigned: true, default: 0 })
  @Min(0)
  couponDiscountAmount: number;
  @Field(() => Int)
  @Column({ unsigned: true, default: 0 })
  @Min(0)
  usedPointAmount: number;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  @MaxLength(30)
  usedCouponName: string;

  @Field()
  @Column({ length: 30 })
  @MaxLength(30)
  brandNameKor: string;
  @Field()
  @Column()
  itemName: string;
  @Field()
  @Column()
  productVariantName: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  recommenderId?: number;
  @Field({ nullable: true })
  @Column({ nullable: true, length: 11 })
  recommenderNickname?: string;

  @ManyToOne('DigestEntity', { onDelete: 'SET NULL', nullable: true })
  recommendDigest: IDigest;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  recommendDigestId: number;

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
  shipReadyAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  shippingAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  shippedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cancelRequestedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  cancelledAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  exchangeRequestedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  exchangedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  refundRequestedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  refundedAt?: Date;

  @Field({ description: '지연발송 전환 시점', nullable: true })
  @Column({ nullable: true })
  delayedAt: Date;
  @Field({ description: '지연발송 예정일', nullable: true })
  @Column({ nullable: true })
  delayedShipExpectedAt: Date;
  @Field({ description: '처리지연 전환 시점', nullable: true })
  @Column({ nullable: true })
  processDelayedAt: Date;

  @Field({ description: '예약발송 예정일', nullable: true })
  @Column({ nullable: true })
  shipReservedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  confirmedAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  settledAt?: Date;
}
