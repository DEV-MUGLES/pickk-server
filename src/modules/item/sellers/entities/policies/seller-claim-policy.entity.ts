import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ClaimFeePayMethod } from '../../constants';
import { ISellerClaimPolicy } from '../../interfaces';

import { SellerClaimAccount } from '../../models/policies/seller-claim-account.model';
import { SellerClaimAccountEntity } from './seller-claim-account.entity';

@ObjectType()
@Entity('seller_claim_policy')
export class SellerClaimPolicyEntity
  extends BaseIdEntity
  implements ISellerClaimPolicy
{
  constructor(attributes?: Partial<SellerClaimPolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.fee = attributes.fee;
    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
    this.feePayMethod = attributes.feePayMethod;
    this.description = attributes.description;

    this.isExchangable = attributes.isExchangable;
    this.isRefundable = attributes.isRefundable;

    this.account = attributes.account;
  }

  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @IsNumber()
  @Min(0)
  fee: number;
  @Field({ description: '담당자 번호' })
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;
  @Field({ description: '담당자 이름' })
  @Column({ length: 20 })
  @IsString()
  @MaxLength(20)
  picName: string;
  @Field(() => ClaimFeePayMethod)
  @Column({
    type: 'enum',
    enum: ClaimFeePayMethod,
    default: ClaimFeePayMethod.Enclose,
  })
  @IsEnum(ClaimFeePayMethod)
  feePayMethod: ClaimFeePayMethod;
  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  description: string;

  @Field()
  @Column({ default: true })
  @IsBoolean()
  isExchangable: boolean;
  @Field()
  @Column({ default: true })
  @IsBoolean()
  isRefundable: boolean;

  @Field(() => SellerClaimAccount, { nullable: true })
  @OneToOne(() => SellerClaimAccountEntity, { cascade: true, nullable: true })
  @JoinColumn()
  account?: SellerClaimAccount;
}
