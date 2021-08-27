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
import { IsEnum, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { StyleTagEntity } from '@content/style-tags/entities';
import { StyleTag } from '@content/style-tags/models';

import { UserOauthProvider, UserRole } from '../constants';
import { IUser } from '../interfaces';

import { RefundAccountEntity } from './refund-account.entity';

import { UserPassword } from '../models/user-password.model';
import { ShippingAddress } from '../models/shipping-address.model';
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

    this.role = attributes.role;
    this.oauthProvider = attributes.oauthProvider;
    this.oauthCode = attributes.oauthCode;

    this.code = attributes.code;
    this.email = attributes.email;
    this.phoneNumber = attributes.phoneNumber;
    this.nickname = attributes.nickname;
    this.avatarUrl = attributes.avatarUrl;

    this.instagramCode = attributes.instagramCode;
    this.youtubeUrl = attributes.youtubeUrl;

    this.name = attributes.name;
    this.weight = attributes.weight;
    this.height = attributes.height;

    this.password = attributes.password;

    this.styleTags = attributes.styleTags;
    this.shippingAddresses = attributes.shippingAddresses;
    this.refundAccount = attributes.refundAccount;

    this.followCount = attributes.followCount;

    this.isFollowing = attributes.isFollowing;
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
  @Column({ nullable: true })
  oauthCode?: string;

  @Field({ nullable: true })
  @Column({ length: 15, nullable: true, unique: true })
  @MaxLength(15)
  @IsOptional()
  code?: string;
  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  email: string;
  @Field({ nullable: true })
  @Column({ type: 'char', length: 11, nullable: true })
  @IsPhoneNumber('KR')
  @MaxLength(11)
  @IsOptional()
  phoneNumber?: string;
  @Field({ description: '최대 11자' })
  @Column({ unique: true, length: 11 })
  nickname: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  @Column({ length: 15, nullable: true })
  name?: string;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', nullable: true })
  weight?: number;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', nullable: true })
  height?: number;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  instagramCode: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  youtubeUrl: string;

  @Column(() => UserPassword)
  password: UserPassword;

  @Field(() => [StyleTag])
  @ManyToMany(() => StyleTagEntity)
  @JoinTable()
  styleTags: StyleTag[];
  @OneToMany('ShippingAddressEntity', 'user', { cascade: true })
  shippingAddresses: ShippingAddress[];
  @Field(() => RefundAccount, { nullable: true })
  @OneToOne(() => RefundAccountEntity, { nullable: true, cascade: true })
  @JoinColumn()
  refundAccount: RefundAccountEntity;

  // queue에서 계산해서 update하는 값들
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  followCount: number;

  // model only fields
  @Field({ description: '[MODEL ONLY]', nullable: true })
  isFollowing: boolean;
}
