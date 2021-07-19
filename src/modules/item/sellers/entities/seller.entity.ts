import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';

import { IsBusinessCode } from '@common/decorators';
import { BaseIdEntity, SaleStrategyEntity } from '@common/entities';
import { SaleStrategy } from '@common/models';
import { BrandEntity } from '@item/brands/entities';
import { Courier } from '@item/couriers/models';
// @TODO:jBARREL
import { CourierEntity } from '@item/couriers/entities/courier.entity';
// @TODO:jBARREL 경로 '@user/users/entities'로 바꾸면 circulrar dependency 생김! 없애기
import { UserEntity } from '@user/users/entities/user.entity';
import { User } from '@user/users/models';

import { ISeller } from '../interfaces';
import {
  SellerShippingPolicyEntity,
  SellerClaimPolicyEntity,
  SellerCrawlPolicyEntity,
  SellerSettlePolicyEntity,
} from './policies';

import {
  SellerShippingPolicy,
  SellerClaimPolicy,
  SellerCrawlPolicy,
  SellerSettlePolicy,
} from '../models/policies';
import { SellerReturnAddress } from '../models/seller-return-address.model';
import { SellerCrawlStrategy } from '../models/seller-crawl-strategy.model';
import { SellerCrawlStrategyEntity } from './seller-crawl-strategy.entity';
import { SellerReturnAddressEntity } from './seller-return-address.entity';

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

  @Field()
  @Column()
  @IsString()
  businessName: string;

  @Field()
  @Column({ type: 'char', length: 12 })
  @IsBusinessCode()
  businessCode: string;

  @Field()
  @Column()
  @IsString()
  mailOrderBusinessCode: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @MaxLength(20)
  representativeName: string;

  @Field()
  @Column()
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @IsOptional()
  orderNotiPhoneNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @IsOptional()
  csNotiPhoneNumber?: string;

  @Field()
  @Column()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  kakaoTalkCode?: string;

  @Field()
  @Column()
  @IsString()
  operationTimeMessage: string;

  @Field(() => User)
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: User;

  @Field(() => Int, { nullable: true })
  @Column()
  @Exclude()
  userId: number;

  @OneToOne('BrandEntity', 'seller')
  @JoinColumn()
  brand: BrandEntity;

  @Field(() => Int, { nullable: true })
  @Column()
  @Exclude()
  brandId: number;

  @Field(() => Courier)
  @ManyToOne(() => CourierEntity)
  @JoinColumn()
  courier: Courier;

  @Field(() => Int, { nullable: true })
  @Column()
  @Exclude()
  courierId: number;

  @Field(() => SaleStrategy)
  @ManyToOne(() => SaleStrategyEntity)
  @JoinColumn()
  saleStrategy: SaleStrategy;

  @Field(() => SellerCrawlStrategy)
  @ManyToOne(() => SellerCrawlStrategyEntity, { cascade: true })
  @JoinColumn()
  crawlStrategy: SellerCrawlStrategy;

  @Field(() => SellerClaimPolicy)
  @OneToOne(() => SellerClaimPolicyEntity, { cascade: true })
  @JoinColumn()
  claimPolicy: SellerClaimPolicy;

  @Field(() => SellerCrawlPolicy)
  @OneToOne(() => SellerCrawlPolicyEntity, { cascade: true })
  @JoinColumn()
  crawlPolicy: SellerCrawlPolicy;

  @Field(() => SellerShippingPolicy)
  @OneToOne(() => SellerShippingPolicyEntity, { cascade: true })
  @JoinColumn()
  shippingPolicy: SellerShippingPolicy;

  @Field(() => SellerSettlePolicy, { nullable: true })
  @OneToOne(() => SellerSettlePolicyEntity, { cascade: true, nullable: true })
  @JoinColumn()
  settlePolicy?: SellerSettlePolicy;

  @Field(() => SellerReturnAddress)
  @OneToOne(() => SellerReturnAddressEntity, { cascade: true })
  @JoinColumn()
  returnAddress: SellerReturnAddress;
}
