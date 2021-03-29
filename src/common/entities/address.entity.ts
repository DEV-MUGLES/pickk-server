import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { IsPostalCode } from 'class-validator';

import { BaseEntity } from './base.entity';
import { IAddress } from '../interfaces/address.interface';

@ObjectType()
export abstract class AbstractAddressEntity
  extends BaseEntity
  implements IAddress {
  constructor(attributes?: Partial<AbstractAddressEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.baseAddress = attributes.baseAddress;
    this.detailAddress = attributes.detailAddress;
    this.postalCode = attributes.postalCode;
  }

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
