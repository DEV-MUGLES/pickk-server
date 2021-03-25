import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IsPostalCode } from 'class-validator';

import { BaseEntity } from './base.entity';
import { IAddress } from '../interfaces/address.interface';

@ObjectType()
export abstract class AbstractAddressEntity
  extends BaseEntity
  implements IAddress {
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
}
