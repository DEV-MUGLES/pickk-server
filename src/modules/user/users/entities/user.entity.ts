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

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { UserOauthProvider, UserRole } from '../constants/user.enum';
import { UserPassword } from '../models/user-password.model';
import { ShippingAddress } from '../models/shipping-address.model';
import { UserAvatarImage } from '../models/user-avatar-image.model';
import { IUser } from '../interfaces/user.interface';
import { UserAvatarImageEntity } from './user-avatar-image.entity';

@ObjectType()
@Entity({
  name: 'user',
})
@Index('idx_code', ['code'], { unique: true })
@Index('idx_oauth_code', ['oauthCode'])
export class UserEntity extends BaseIdEntity implements IUser {
  @Field(() => UserRole, { nullable: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field(() => UserOauthProvider, { nullable: true })
  @Column({
    type: 'enum',
    enum: UserOauthProvider,
    nullable: true,
  })
  @IsEnum(UserOauthProvider)
  @IsOptional()
  oauthProvider?: UserOauthProvider;

  @Field({ nullable: true })
  @Column({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  oauthCode?: string;

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
    unique: true,
    length: 11,
  })
  @IsString()
  nickname: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

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
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  avatarImage: UserAvatarImageEntity;
}
