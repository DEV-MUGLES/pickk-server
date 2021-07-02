import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { SellerClaimAccount } from '../../models/policies/seller-claim-account.model';
import { SellerClaimAccountEntity } from './seller-claim-account.entity';
import { ISellerSettlePolicy } from '../../interfaces/policies/seller-settle-policy.interface';

@ObjectType()
@Entity('seller_settle_policy')
export class SellerSettlePolicyEntity
  extends BaseIdEntity
  implements ISellerSettlePolicy {
  constructor(attributes?: Partial<SellerSettlePolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
    this.email = attributes.email;

    this.account = attributes.account;
    this.rate = attributes.rate;
  }

  @Field({ description: '담당자 번호' })
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @MaxLength(20)
  picName: string;

  @Field({ description: '세금계산서 수령이메일' })
  @Column()
  @IsEmail()
  email: string;

  @Field(() => SellerClaimAccount, { description: '정산 받을 계좌' })
  @OneToOne(() => SellerClaimAccountEntity, { cascade: true })
  @JoinColumn()
  account: SellerClaimAccount;

  @Field(() => Int, { description: '정산율' })
  @Column({ type: 'tinyint', unsigned: true, default: 70 })
  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;
}
