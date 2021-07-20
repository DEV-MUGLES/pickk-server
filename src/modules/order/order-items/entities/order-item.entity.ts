import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
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
export class OrderItemEntity extends BaseIdEntity implements IOrderItem {
  constructor(attributes?: Partial<OrderItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;
    this.item = attributes.item;
    this.itemId = attributes.itemId;
    this.product = attributes.product;
    this.productId = attributes.productId;

    this.status = attributes.status;
    this.claimStatus = attributes.claimStatus;
    this.quantity = attributes.quantity;

    this.isConfirmed = attributes.isConfirmed;
    this.isSettled = attributes.isSettled;

    this.itemFinalPrice = attributes.itemFinalPrice;
    this.couponDiscountAmount = attributes.couponDiscountAmount;
    this.usedPointAmount = attributes.usedPointAmount;
    this.payAmount = attributes.payAmount;

    this.brandNameKor = attributes.brandNameKor;
    this.itemName = attributes.itemName;
    this.productVariantName = attributes.productVariantName;

    this.recommenderId = attributes.recommenderId;
    this.recommenderNickname = attributes.recommenderNickname;

    this.referrer = attributes.referrer;
    this.referrerId = attributes.referrerId;

    this.courier = attributes.courier;
    this.courierId = attributes.courierId;
    this.trackCode = attributes.trackCode;

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

  @Field(() => Seller, { nullable: true })
  @ManyToOne('SellerEntity', { nullable: true })
  seller?: Seller;

  @Field({
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

  @Field({
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

  @Field({
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
  @Column({ type: 'int' })
  orderId: number;

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
  @Column({ unsigned: true })
  @Min(0)
  couponDiscountAmount: number;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(0)
  usedPointAmount: number;

  @Field(() => Int)
  @Column({ unsigned: true })
  @Min(1)
  payAmount: number;

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

  @Field({
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

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  referrer?: User;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  referrerId?: number;

  @Field(() => Courier, { nullable: true })
  @ManyToOne('CourierEntity', { nullable: true })
  courier?: Courier;

  @Field({
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
