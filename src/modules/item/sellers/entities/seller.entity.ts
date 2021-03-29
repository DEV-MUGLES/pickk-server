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

import { IsBusinessCode } from '@src/common/decorators/validations/is-business-code';
import { BaseEntity } from '@src/common/entities/base.entity';
import { UserEntity } from '@src/modules/user/users/entities/user.entity';
import { User } from '@src/modules/user/users/models/user.model';

import { Brand } from '../../brands/models/brand.model';
import { BrandEntity } from '../../brands/entities/brand.entity';
import { ISeller } from '../interfaces/seller.interface';
import { SaleStrategyEntity } from '@src/common/entities/sale-strategy.entity';
import { SaleStrategy } from '@src/common/models/sale-strategy.model';
import { SellerShippingPolicyEntity } from './policies/seller-shipping-policy.entity';
import { SellerShippingPolicy } from '../models/policies/seller-shipping-policy.model';
import { SellerClaimPolicy } from '../models/policies/seller-claim-policy.model';
import { SellerClaimPolicyEntity } from './policies/seller-claim-policy.entity';

@ObjectType()
@Entity('seller')
export class SellerEntity extends BaseEntity implements ISeller {
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

  @Field(() => Brand)
  @OneToOne(() => BrandEntity)
  @JoinColumn()
  brand: Brand;

  @Field(() => Int, { nullable: true })
  @Column()
  @Exclude()
  brandId: number;

  @Field(() => SaleStrategy)
  @ManyToOne(() => SaleStrategyEntity)
  @JoinColumn()
  saleStrategy: SaleStrategy;

  @Field(() => SellerClaimPolicy)
  @OneToOne(() => SellerClaimPolicyEntity, { cascade: true })
  @JoinColumn()
  claimPolicy: SellerClaimPolicy;

  @Field(() => SellerShippingPolicy)
  @OneToOne(() => SellerShippingPolicyEntity, { cascade: true })
  @JoinColumn()
  shippingPolicy: SellerShippingPolicy;
}
