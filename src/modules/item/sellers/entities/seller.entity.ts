import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IsEmail, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';

import { IsBusinessCode } from '@common/decorators';
import { BaseIdEntity, SaleStrategyEntity } from '@common/entities';
import { SaleStrategy } from '@common/models';

import { IBrand } from '@item/brands/interfaces';
import { ICourier } from '@item/couriers/interfaces';
import { IUser } from '@user/users/interfaces';

import {
  ISeller,
  ISellerClaimPolicy,
  ISellerCrawlPolicy,
  ISellerCrawlStrategy,
  ISellerReturnAddress,
  ISellerSettlePolicy,
  ISellerShippingPolicy,
} from '../interfaces';

@ObjectType()
@Entity('seller')
export class SellerEntity extends BaseIdEntity implements ISeller {
  constructor(attributes?: Partial<SellerEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.businessName = attributes.businessName;
    this.businessCode = attributes.businessCode;
    this.mailOrderBusinessCode = attributes.mailOrderBusinessCode;
    this.representativeName = attributes.representativeName;
    this.email = attributes.email;

    this.orderNotiPhoneNumber = attributes.orderNotiPhoneNumber;
    this.csNotiPhoneNumber = attributes.csNotiPhoneNumber;

    this.phoneNumber = attributes.phoneNumber;
    this.operationTimeMessage = attributes.operationTimeMessage;
    this.kakaoTalkCode = attributes.kakaoTalkCode;

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.brand = attributes.brand;
    this.brandId = attributes.brandId;
    this.courier = attributes.courier;
    this.courierId = attributes.courierId;

    this.saleStrategy = attributes.saleStrategy;
    this.claimPolicy = attributes.claimPolicy;
    this.crawlPolicy = attributes.crawlPolicy;
    this.shippingPolicy = attributes.shippingPolicy;
    this.settlePolicy = attributes.settlePolicy;

    this.returnAddress = attributes.returnAddress;
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  businessName: string;
  @Field({ nullable: true })
  @Column({ type: 'char', length: 12, nullable: true })
  @IsBusinessCode()
  @IsOptional()
  businessCode: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  mailOrderBusinessCode: string;
  @Field({ description: '최대 20자', nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  @MaxLength(20)
  @IsOptional()
  representativeName: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber('KR')
  @IsOptional()
  phoneNumber: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber('KR')
  @IsOptional()
  orderNotiPhoneNumber: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber('KR')
  @IsOptional()
  csNotiPhoneNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  kakaoTalkCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  operationTimeMessage: string;

  @OneToOne('BrandEntity', { onDelete: 'SET NULL' })
  @JoinColumn()
  user: IUser;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userId: number;
  @OneToOne('BrandEntity', 'seller', { onDelete: 'SET NULL' })
  @JoinColumn()
  brand: IBrand;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  brandId: number;

  @ManyToOne('CourierEntity', { onDelete: 'SET NULL' })
  @JoinColumn()
  courier: ICourier;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  courierId: number;

  @ManyToOne(() => SaleStrategyEntity)
  @JoinColumn()
  saleStrategy: SaleStrategy;

  @ManyToOne('SellerCrawlStrategyEntity', 'seller', { cascade: true })
  @JoinColumn()
  crawlStrategy: ISellerCrawlStrategy;
  @OneToOne('SellerClaimPolicyEntity', 'seller', { cascade: true })
  @JoinColumn()
  claimPolicy: ISellerClaimPolicy;
  @OneToOne('SellerCrawlPolicyEntity', 'seller', { cascade: true })
  @JoinColumn()
  crawlPolicy: ISellerCrawlPolicy;
  @OneToOne('SellerShippingPolicyEntity', 'seller', { cascade: true })
  @JoinColumn()
  shippingPolicy: ISellerShippingPolicy;
  @OneToOne('SellerSettlePolicyEntity', 'seller', { cascade: true })
  @JoinColumn()
  settlePolicy?: ISellerSettlePolicy;
  @OneToOne('SellerReturnAddressEntity', 'seller', { cascade: true })
  @JoinColumn()
  returnAddress: ISellerReturnAddress;
}
