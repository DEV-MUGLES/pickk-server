import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import { IsPhoneNumber, IsUrl, MaxLength } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ICourier } from '../interfaces';

@ObjectType()
@Entity({ name: 'courier' })
@Index('idx-code', ['code'], { unique: true })
@Index('idx-name', ['name'], { unique: true })
export class CourierEntity extends BaseIdEntity implements ICourier {
  constructor(attributes?: Partial<CourierEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.code = attributes.code;
    this.name = attributes.name;
    this.phoneNumber = attributes.phoneNumber;
    this.returnReserveUrl = attributes.returnReserveUrl;
  }

  @Field()
  @Column({ length: 30, unique: true })
  @MaxLength(30)
  code: string;
  @Field()
  @Column({ length: 20, unique: true })
  name: string;
  @Field()
  @Column({ type: 'char', length: 12 })
  @IsPhoneNumber('KR')
  phoneNumber: string;
  @Field()
  @Column({ length: 300 })
  @IsUrl()
  returnReserveUrl: string;
}
