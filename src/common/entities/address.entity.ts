import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsPhoneNumber, IsPostalCode } from 'class-validator';
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
  @IsPostalCode('DE')
  postalCode: string;

  @Field()
  @Column()
  @IsPhoneNumber('KR')
  phoneNumber1: string;

  @Field({ nullable: true })
  @Column()
  @IsPhoneNumber('KR')
  @IsOptional()
  phoneNumber2?: string;
}
