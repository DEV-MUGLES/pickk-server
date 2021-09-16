import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsEmail, IsPhoneNumber, Max, MaxLength, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import {
  ISeller,
  ISellerSettleAccount,
  ISellerSettlePolicy,
} from '../../interfaces';

@ObjectType()
@Entity('seller_settle_policy')
export class SellerSettlePolicyEntity
  extends BaseIdEntity
  implements ISellerSettlePolicy
{
  constructor(attributes?: Partial<SellerSettlePolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.account = attributes.account;

    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
    this.email = attributes.email;

    this.rate = attributes.rate;
  }

  @OneToOne('SellerEntity', 'settlePolicy', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;

  @OneToOne('SellerSettleAccountEntity', { cascade: true })
  account: ISellerSettleAccount;

  @Field({ description: '담당자 번호' })
  @Column({ type: 'char', length: 12 })
  @IsPhoneNumber('KR')
  phoneNumber: string;
  @Field()
  @Column({ length: 20 })
  @MaxLength(20)
  picName: string;
  @Field({ description: '세금계산서 수령이메일' })
  @Column()
  @IsEmail()
  email: string;

  @Field(() => Int, { description: '기본 정산율' })
  @Column({ type: 'tinyint', unsigned: true, default: 70 })
  @Min(0)
  @Max(100)
  rate: number;
}
