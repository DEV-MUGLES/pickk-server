import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';
import { IUser } from '../interfaces/user.interface';
import { UserPasswordEntity } from './user-password.entity';
import { UserPassword } from '../models/user-password.model';

@ObjectType()
@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity implements IUser {
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

  @Field(() => Int, { nullable: true })
  @Column({
    type: 'smallint',
    nullable: true,
  })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  weight?: number;

  @Field(() => Int, { nullable: true })
  @Column({
    type: 'smallint',
    nullable: true,
  })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  height?: number;

  @Column(() => UserPassword)
  password: UserPassword;
}
