import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IsEnum, IsNumberString, IsString, MaxLength } from 'class-validator';

import { getBankDisplayName } from '@common/helpers/bank-code.helper';
import { BankCode } from '@common/constants';

import { IAccount } from '../interfaces';

import { BaseIdEntity } from './base.entity';

@ObjectType()
export abstract class AbstractAccountEntity
  extends BaseIdEntity
  implements IAccount
{
  constructor(attributes?: Partial<AbstractAccountEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.bankCode = attributes.bankCode;
    this.number = attributes.number;
    this.ownerName = attributes.ownerName;
  }

  get bankDisplayName() {
    return getBankDisplayName(this.bankCode);
  }

  @Field(() => BankCode)
  @Column({
    type: 'enum',
    enum: BankCode,
  })
  @IsEnum(BankCode)
  bankCode: BankCode;

  @Field({
    description: '계좌번호입니다.("-" 제외) 최대 14자까지 입력 가능합니다.',
  })
  @Column({
    length: 14,
  })
  @MaxLength(14)
  @IsNumberString()
  number: string;

  @Field()
  @Column()
  @IsString()
  ownerName: string;
}
