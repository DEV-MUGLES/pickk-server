import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IsEnum, IsNumberString, IsString, MaxLength } from 'class-validator';
import { InicisBankCode } from 'inicis';

import { BaseIdEntity } from './base.entity';
import { IAccount } from '../interfaces/account.interface';

@ObjectType()
export abstract class AbstractAccountEntity
  extends BaseIdEntity
  implements IAccount {
  constructor(attributes?: Partial<AbstractAccountEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.bankCode = attributes.bankCode;
    this.number = attributes.number;
    this.ownerName = attributes.ownerName;
  }

  @Field(() => InicisBankCode)
  @Column({
    type: 'enum',
    enum: InicisBankCode,
  })
  @IsEnum(InicisBankCode)
  bankCode: InicisBankCode;

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
