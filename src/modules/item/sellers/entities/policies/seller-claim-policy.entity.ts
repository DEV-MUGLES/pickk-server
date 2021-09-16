import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  IsBoolean,
  IsNumber,
  IsPhoneNumber,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ISeller, ISellerClaimPolicy } from '../../interfaces';

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

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.fee = attributes.fee;
    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
    this.description = attributes.description;

    this.isExchangable = attributes.isExchangable;
    this.isRefundable = attributes.isRefundable;
  }

  @OneToOne('SellerEntity', 'claimPolicy', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;

  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @IsNumber()
  @Min(0)
  fee: number;
  @Field({ description: '담당자 번호' })
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  phoneNumber: string;
  @Field({ description: '담당자 이름' })
  @Column({ length: 20 })
  @MaxLength(20)
  picName: string;
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
}
