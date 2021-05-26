import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { ISellerClaimPolicy } from '../../interfaces/policies';
import { ClaimFeePayMethod } from '../../constants/seller-claim-policy.enum';

@ObjectType()
@Entity('seller_claim_policy')
export class SellerClaimPolicyEntity
  extends BaseIdEntity
  implements ISellerClaimPolicy {
  constructor(attributes?: Partial<SellerClaimPolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.fee = attributes.fee;
    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
    this.feePayMethod = attributes.feePayMethod;
  }

  @Field(() => Int)
  @Column({ type: 'mediumint' })
  @IsNumber()
  @Min(0)
  fee: number;

  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;

  @Field()
  @Column({ type: 'varchar', length: 20 })
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
}
