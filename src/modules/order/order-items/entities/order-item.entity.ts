import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { ContentType } from '@common/constants';
import { Courier } from '@item/couriers/models';
import { Item } from '@item/items/models';
import { Product } from '@item/products/models';
import { Seller } from '@item/sellers/models';
import { IOrder } from '@order/orders/interfaces';
import { User } from '@user/users/models';

import { OrderItemStatus, OrderItemClaimStatus } from '../constants';
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

    this.order = attributes.order;
    this.orderMerchantUid = attributes.orderMerchantUid;

    this.status = attributes.status;
    this.claimStatus = attributes.claimStatus;
    this.quantity = attributes.quantity;

    this.isConfirmed = attributes.isConfirmed;
    this.isSettled = attributes.isSettled;

    this.itemFinalPrice = attributes.itemFinalPrice;
    this.couponDiscountAmount = attributes.couponDiscountAmount;
    this.usedPointAmount = attributes.usedPointAmount;

    this.brandNameKor = attributes.brandNameKor;
    this.itemName = attributes.itemName;
    this.productVariantName = attributes.productVariantName;

    this.recommenderId = attributes.recommenderId;
    this.recommenderNickname = attributes.recommenderNickname;
    this.recommendContentType = attributes.recommendContentType;
    this.recommendContentItemId = attributes.recommendContentItemId;

    this.courier = attributes.courier;
    this.courierId = attributes.courierId;
    this.trackCode = attributes.trackCode;

    this.failedAt = attributes.failedAt;
    this.paidAt = attributes.paidAt;
    this.withdrawnAt = attributes.withdrawnAt;
    this.shipReadyAt = attributes.shipReadyAt;
    this.shippingAt = attributes.shippingAt;
    this.shippedAt = attributes.shippedAt;

    this.cancelRequestedAt = attributes.cancelRequestedAt;
    this.cancelledAt = attributes.cancelledAt;
    this.exchangeRequestedAt = attributes.exchangeRequestedAt;
    this.exchangedAt = attributes.exchangedAt;
    this.refundRequestedAt = attributes.refundRequestedAt;
    this.refundedAt = attributes.refundedAt;

    this.shipReservedAt = attributes.shipReservedAt;
    this.confirmedAt = attributes.confirmedAt;
    this.settledAt = attributes.settledAt;
  }

  @Field(() => String, {
    description:
      '주문상품고유번호. PrimaryColumn입니다. order의 merchantUid + 숫자 1자리 형식입니다.',
  })
  @PrimaryColumn({ type: 'char', length: 22 })
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

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  userId?: number;

  @Field(() => Seller, { nullable: true })
  @ManyToOne('SellerEntity', { nullable: true })
  seller?: Seller;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  sellerId?: number;

  @Field(() => Item, { nullable: true })
  @ManyToOne('ItemEntity', { nullable: true })
  item?: Item;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  itemId?: number;

  @Field(() => Product, { nullable: true })
  @ManyToOne('ProductEntity', { nullable: true })
  product?: Product;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  productId?: number;

  @ManyToOne('OrderEntity')
  order: IOrder;

  @Field()
  @Column({ type: 'char', length: 20 })
  orderMerchantUid: string;

  @Field(() => OrderItemStatus)
  @Column({
    type: 'enum',
    enum: OrderItemStatus,
  })
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
  @IsOptional()
  isConfirmed: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  @IsOptional()
  isSettled: boolean;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  itemFinalPrice: number;

  @Field(() => Int)
  @Column({ unsigned: true, default: 0 })
  @Min(0)
  couponDiscountAmount: number;

  @Field(() => Int)
  @Column({ unsigned: true, default: 0 })
  @Min(0)
  usedPointAmount: number;

  @Field()
  @Column({
    type: 'varchar',
    length: 30,
  })
  @MaxLength(30)
  brandNameKor: string;

  @Field()
  @Column()
  @IsString()
  itemName: string;

  @Field()
  @Column()
  @IsString()
  productVariantName: string;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  recommenderId?: number;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    length: 11,
  })
  recommenderNickname?: string;

  @Field(() => ContentType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ContentType,
    nullable: true,
  })
  recommendContentType?: ContentType;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  recommendContentItemId?: number;

  @Field(() => Courier, { nullable: true })
  @ManyToOne('CourierEntity', { nullable: true })
  courier?: Courier;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  courierId?: number;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    length: 30,
  })
  @MaxLength(30)
  trackCode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  failedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  withdrawnAt?: Date;

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
