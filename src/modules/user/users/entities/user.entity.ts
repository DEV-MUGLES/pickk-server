import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
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

import { UserRole } from '../constants/user.enum';
import { UserPassword } from '../models/user-password.model';
import { ShippingAddress } from '../models/shipping-address.model';
import { UserAvatarImage } from '../models/user-avatar-image.model';
import { IUser } from '../interfaces/user.interface';
import { UserAvatarImageEntity } from './user-avatar-image.entity';

@ObjectType()
@Entity({
  name: 'user',
})
@Index('idx_email', ['email'], { unique: true })
@Index('idx_code', ['code'], { unique: true })
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

  @Field({
    nullable: true,
  })
  @Column({
    unique: true,
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    unique: true,
  })
  @IsString()
  @IsOptional()
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

  @Field(() => UserAvatarImage, { nullable: true })
  @OneToOne(() => UserAvatarImageEntity, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  avatarImage: UserAvatarImageEntity;
}
