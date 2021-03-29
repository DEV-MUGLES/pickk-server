import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';

import { ISellerClaimPolicy } from '../../interfaces/policies';

@ObjectType()
@Entity('seller_claim_policy')
export class SellerClaimPolicyEntity
  extends BaseEntity
  implements ISellerClaimPolicy {
  constructor(attributes?: Partial<SellerClaimPolicyEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.fee = attributes.fee;
    this.phoneNumber = attributes.phoneNumber;
    this.picName = attributes.picName;
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
}
