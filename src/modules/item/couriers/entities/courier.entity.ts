import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  IsPhoneNumber,
  IsNumberString,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ICourier } from '../interfaces';
import { CourierIssue } from '../models';
import { CourierIssueEntity } from './courier-issue.entity';

@ObjectType()
@Entity({
  name: 'courier',
})
export class CourierEntity extends BaseIdEntity implements ICourier {
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

  @Field(() => CourierIssue, { nullable: true })
  @OneToOne(() => CourierIssueEntity, { cascade: true, nullable: true })
  @JoinColumn()
  issue?: CourierIssue;
}
