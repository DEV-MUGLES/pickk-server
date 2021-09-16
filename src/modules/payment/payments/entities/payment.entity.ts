import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { BankCode } from '@common/constants';

import {
  CardCode,
  PayEnviroment,
  PaymentStatus,
  PayMethod,
  Pg,
} from '../constants';
import { IPayment, IPaymentCancellation } from '../interfaces';

@ObjectType()
@Entity('payment')
@Index('id_pg-tid', ['pgTid'])
export class PaymentEntity implements IPayment {
  constructor(attributes?: Partial<PaymentEntity>) {
    if (!attributes) {
      return;
    }
    this.cancellations = attributes.cancellations;

    this.merchantUid = attributes.merchantUid;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.status = attributes.status;
    this.env = attributes.env;
    this.origin = attributes.origin;
    this.pg = attributes.pg;
    this.pgTid = attributes.pgTid;
    this.payMethod = attributes.payMethod;
    this.name = attributes.name;
    this.amount = attributes.amount;
    this.failedReason = attributes.failedReason;

    this.buyerName = attributes.buyerName;
    this.buyerTel = attributes.buyerTel;
    this.buyerEmail = attributes.buyerEmail;
    this.buyerAddr = attributes.buyerAddr;
    this.buyerPostalcode = attributes.buyerPostalcode;

    this.applyNum = attributes.applyNum;
    this.cardCode = attributes.cardCode;
    this.cardNum = attributes.cardNum;

    this.vbankCode = attributes.vbankCode;
    this.vbankNum = attributes.vbankNum;
    this.vbankHolder = attributes.vbankHolder;

    this.failedAt = attributes.failedAt;
    this.paidAt = attributes.paidAt;
    this.cancelledAt = attributes.cancelledAt;
    this.vbankDodgedAt = attributes.vbankDodgedAt;
  }

  @OneToMany('PaymentCancellationEntity', 'payment', {
    cascade: true,
  })
  @JoinColumn()
  cancellations: IPaymentCancellation[];

  @Field({ description: '(PK) 결제유번호. YYMMDDHHmmssSSS + NN(00~99) 형식' })
  @PrimaryColumn({ type: 'char', length: 20 })
  @IsString()
  merchantUid: string;
  @Field()
  @CreateDateColumn()
  createdAt: Date;
  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => PaymentStatus)
  @Column({ type: 'enum', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
  @Field(() => PayEnviroment)
  @Column({ type: 'enum', enum: PayEnviroment })
  @IsEnum(PayEnviroment)
  env: PayEnviroment;
  @Field()
  @Column()
  origin: string;
  @Field(() => Pg)
  @Column({ type: 'enum', enum: Pg })
  @IsEnum(Pg)
  pg: Pg;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  pgTid: string;
  @Field(() => PayMethod)
  @Column({ type: 'enum', enum: PayMethod })
  @IsEnum(PayMethod)
  payMethod: PayMethod;
  @Field()
  @Column()
  @IsString()
  name: string;
  @Field(() => Int)
  @Column({ type: 'int', unsigned: true })
  @IsNumber()
  @Min(1)
  amount: number;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  failedReason: string;

  // 주문자 정보
  @Field()
  @Column({ length: 20 })
  @IsString()
  @MaxLength(20)
  buyerName: string;
  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @MaxLength(11)
  buyerTel: string;
  @Field()
  @Column()
  @IsEmail()
  buyerEmail: string;
  @Field()
  @Column({ type: 'char', length: 6 })
  // @TODO: https://github.com/validatorjs/validator.js/pull/1628 가 머지 및 release 완료되면 국가코드 'KR'로 변경하기!
  @IsPostalCode('DE')
  @MaxLength(6)
  buyerPostalcode: string;
  @Field()
  @Column()
  @IsString()
  buyerAddr: string;

  // 신용 카드 관련 정보
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  applyNum?: string;
  @Field(() => CardCode, { nullable: true })
  @Column({ type: 'enum', enum: CardCode, nullable: true })
  @IsEnum(CardCode)
  @IsOptional()
  cardCode?: CardCode;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  cardNum?: string;

  // 가상계좌 관련 정보
  @Field(() => BankCode, { nullable: true })
  @Column({ type: 'enum', enum: BankCode, nullable: true })
  @IsEnum(BankCode)
  @IsOptional()
  vbankCode?: BankCode;
  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  vbankNum?: string;
  @Field({ nullable: true })
  @Column({ length: 15, nullable: true })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  vbankHolder?: string;
  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  vbankDate?: Date;

  // timestamps

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;
  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  vbankReadyAt?: Date;
  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;
  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;
  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  vbankDodgedAt: Date;
}
