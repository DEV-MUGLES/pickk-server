import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { BankCode } from '@common/constants';
import { Payment } from '@payment/payments/models';

export class InicisCancelDto {
  payment: Payment;

  @IsNumber()
  amount: number;

  @IsString()
  reason: string;

  @IsNumber()
  @IsOptional()
  taxFree?: number;

  @IsEnum(BankCode)
  @IsOptional()
  refundVbankCode?: BankCode;

  @IsString()
  @IsOptional()
  refundVbankNum?: string;

  @IsString()
  @IsOptional()
  refundVbankHolder?: string;
}
