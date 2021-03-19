import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@src/common/entities/base.entity';
import {
  IsPhoneNumber,
  IsNumberString,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ICourier } from '../interfaces/courier.interface';

@ObjectType()
@Entity({
  name: 'courier',
})
export class CourierEntity extends BaseEntity implements ICourier {
  @Field()
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  @IsString()
  @MaxLength(30)
  code: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  @IsString()
  name: string;

  @Field()
  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  phoneNumber: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 300,
  })
  @IsUrl()
  returnReserveUrl: string;
}
