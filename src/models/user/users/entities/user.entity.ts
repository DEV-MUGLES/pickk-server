import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';
import { IUser } from '../interfaces/user.interface';

@ObjectType()
@Entity({
  name: 'user',
})
export class User extends BaseEntity implements IUser {
  @Field()
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Column({
    nullable: true,
    default: null,
    unique: true,
  })
  @IsString()
  code?: string;

  @Field()
  @Column()
  @IsString()
  name: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
    default: null,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @Column({
    type: 'smallint',
    nullable: true,
  })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  weight?: number;

  @Field({ nullable: true })
  @Column({
    type: 'smallint',
    nullable: true,
  })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  height?: number;
}
