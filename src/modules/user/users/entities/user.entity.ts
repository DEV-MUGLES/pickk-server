import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { StyleTagEntity } from '@content/style-tags/entities';
import { StyleTag } from '@content/style-tags/models';

import { UserOauthProvider, UserRole } from '../constants';
import { IUser } from '../interfaces';

import { UserAvatarImageEntity } from './user-avatar-image.entity';
import { RefundAccountEntity } from './refund-account.entity';

import { UserPassword } from '../models/user-password.model';
import { ShippingAddress } from '../models/shipping-address.model';
import { UserAvatarImage } from '../models/user-avatar-image.model';
import { RefundAccount } from '../models/refund-account.model';

@ObjectType()
@Entity({
  name: 'user',
})
@Index('idx_code', ['code'], { unique: true })
@Index('idx_oauth_code', ['oauthCode'])
export class UserEntity extends BaseIdEntity implements IUser {
  constructor(attributes?: Partial<UserEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.email = attributes.email;
    this.phoneNumber = attributes.phoneNumber;
    this.code = attributes.code;
    this.nickname = attributes.nickname;

    this.name = attributes.name;
    this.weight = attributes.weight;
    this.height = attributes.height;
    this.password = attributes.password;

    this.role = attributes.role;
    this.oauthProvider = attributes.oauthProvider;
    this.oauthCode = attributes.oauthCode;

    this.styleTags = attributes.styleTags;
    this.shippingAddresses = attributes.shippingAddresses;
    this.avatarImage = attributes.avatarImage;
    this.refundAccount = attributes.refundAccount;
  }

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
  @Column({ type: 'char', length: 11, nullable: true })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @MaxLength(11)
  @IsOptional()
  phoneNumber?: string;

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

  @Field(() => [StyleTag])
  @ManyToMany(() => StyleTagEntity)
  @JoinTable()
  styleTags: StyleTag[];
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
  @Field(() => RefundAccount, { nullable: true })
  @OneToOne(() => RefundAccountEntity, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  refundAccount: RefundAccountEntity;
}
