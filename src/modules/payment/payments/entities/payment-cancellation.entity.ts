import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { BankCode } from '@common/constants';
import { BaseIdEntity } from '@common/entities';

import { PaymentCancellationType } from '../constants';
import { IPayment, IPaymentCancellation } from '../interfaces';

@ObjectType()
@Entity('payment_cancellation')
export class PaymentCancellationEntity
  extends BaseIdEntity
  implements IPaymentCancellation
{
  constructor(attributes?: Partial<PaymentCancellationEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.payment = attributes.payment;

    this.type = attributes.type;
    this.amount = attributes.amount;
    this.reason = attributes.reason;
    this.taxFree = attributes.taxFree;

    this.refundVbankCode = attributes.refundVbankCode;
    this.refundVbankHolder = attributes.refundVbankHolder;
    this.refundVbankNum = attributes.refundVbankNum;
  }

  @ManyToOne('PaymentEntity', 'cancellations', { onDelete: 'RESTRICT' })
  payment: IPayment;

  @Field(() => PaymentCancellationType)
  @Column({ type: 'enum', enum: PaymentCancellationType })
  @IsEnum(PaymentCancellationType)
  type: PaymentCancellationType;
  @Field(() => Int)
  @Column({ type: 'int', unsigned: true })
  @IsNumber()
  @Min(1)
  amount: number;
  @Field()
  @Column({ length: 30 })
  @IsString()
  @MaxLength(30)
  reason: string;
  @Field(() => Int)
  @Column({ type: 'int', unsigned: true, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxFree?: number;

  // 가상계좌 관련 정보

  @Field(() => BankCode)
  @Column({ type: 'enum', enum: BankCode, nullable: true })
  @IsEnum(BankCode)
  @IsOptional()
  refundVbankCode?: BankCode;
  @Field()
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  refundVbankNum?: string;
  @Field()
  @Column({ length: 15, nullable: true })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  refundVbankHolder?: string;
}
