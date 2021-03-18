import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
} from 'class-validator';
import { Column } from 'typeorm';

import { BaseEntity } from './base.entity';
import { IAddress } from '../interfaces/address.interface';

@ObjectType()
export abstract class AbstractAddressEntity
  extends BaseEntity
  implements IAddress {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  receiverName: string;

  @Field()
  @Column()
  baseAddress: string;

  @Field()
  @Column()
  detailAddress: string;

  @Field()
  @Column()
  // @TODO: https://github.com/validatorjs/validator.js/pull/1628 가 머지 및 release 완료되면 국가코드 'KR'로 변경하기!
  @IsPostalCode('DE')
  postalCode: string;

  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber1: string;

  @Field({ nullable: true })
  @Column({ type: 'char', length: 11, nullable: true })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @IsOptional()
  phoneNumber2?: string;
}
