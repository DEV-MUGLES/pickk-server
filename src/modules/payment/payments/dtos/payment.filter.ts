import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { Pg, PaymentStatus, PayMethod } from '../constants';
import { IPayment } from '../interfaces';

@InputType()
export class PaymentFilter implements Partial<IPayment> {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  merchantUid?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pgTid?: string;

  @Field(() => [Pg], { nullable: true })
  @IsOptional()
  @IsEnum(Pg, { each: true })
  pgIn?: Pg[];

  @Field(() => [PayMethod], { nullable: true })
  @IsOptional()
  @IsEnum(PayMethod, { each: true })
  payMethodIn?: PayMethod[];

  @Field(() => [PaymentStatus], { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus, { each: true })
  statusIn?: PaymentStatus[];

  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  createdAtBetween?: [Date, Date];
  @Field(() => [Date, Date], { nullable: true })
  @IsOptional()
  paidAtBetween?: [Date, Date];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  merchantUidSearch?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pgTidSearch?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  buyerNameSearch?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  buyerEmailSearch?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  buyerTelSearch?: string;
}
