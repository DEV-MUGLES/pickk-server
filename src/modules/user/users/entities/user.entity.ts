import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';
import { IUser } from '../interfaces/user.interface';
import { UserPassword } from '../models/user-password.model';
import { ShippingAddress } from '../models/shipping-address.model';
import { UserRole } from '../constants/user.enum';

@ObjectType()
@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity implements IUser {
  @Field(() => UserRole, { nullable: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field()
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    default: null,
    unique: true,
  })
  @IsString()
  @MaxLength(15)
  code?: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 15,
  })
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

  @OneToMany('ShippingAddressEntity', 'user', {
    cascade: true,
  })
  shippingAddresses: ShippingAddress[];
}
