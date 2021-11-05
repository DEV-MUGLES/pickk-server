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

import {
  DEFAULT_AVATAR_URL,
  UserMainChannel,
  UserOauthProvider,
  UserRole,
} from '../constants';
import { IRefundAccount, IShippingAddress, IUser } from '../interfaces';

import { UserPassword } from '../models/user-password.model';

@ObjectType()
@Entity({ name: 'user' })
@Index('idx-code', ['code'], { unique: true })
@Index('idx-nickname', ['nickname'], { unique: true })
@Index('idx-oauth_code', ['oauthCode'])
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
    this.description = attributes.description;
    this._avatarUrl = attributes._avatarUrl;
    this.avatarUrl = attributes.avatarUrl;

    this.naverCode = attributes.naverCode;
    this.instagramCode = attributes.instagramCode;
    this.youtubeUrl = attributes.youtubeUrl;
    this.mainChannel = attributes.mainChannel;
    this.isCeleb = attributes.isCeleb;

    this.name = attributes.name;
    this.weight = attributes.weight;
    this.height = attributes.height;

    this.password = attributes.password;

    this.styleTags = attributes.styleTags;
    this.shippingAddresses = attributes.shippingAddresses;
    this.refundAccount = attributes.refundAccount;

    this.followCount = attributes.followCount;

    this.isFollowing = attributes.isFollowing;
    this.isMe = attributes.isMe;
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
  @Column({ nullable: true })
  email: string;
  @Field({ nullable: true })
  @Column({ type: 'char', length: 12, nullable: true })
  @IsPhoneNumber('KR')
  @MaxLength(11)
  @IsOptional()
  phoneNumber?: string;
  @Field({ description: '최대 11자' })
  @Column({ unique: true, length: 21 })
  nickname: string;
  @Field({ description: '최대 255자', nullable: true })
  @Column({ nullable: true })
  description: string;
  @Column({ name: 'avatarUrl', nullable: true })
  _avatarUrl: string;
  @Field(() => String, { nullable: true })
  get avatarUrl(): string {
    return this._avatarUrl ?? DEFAULT_AVATAR_URL;
  }
  set avatarUrl(input: string) {
    this._avatarUrl = input;
  }

  @Field({ nullable: true })
  @Column({ length: 15, nullable: true })
  name?: string;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  weight?: number;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  height?: number;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  naverCode: string;
  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  instagramCode: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  youtubeUrl: string;
  @Field(() => UserMainChannel, { nullable: true })
  @Column({ type: 'enum', enum: UserMainChannel, nullable: true })
  mainChannel: UserMainChannel;
  @Field()
  @Column({ default: false })
  isCeleb: boolean;

  @Column(() => UserPassword)
  password: UserPassword;

  @Field(() => [StyleTag])
  @ManyToMany(() => StyleTagEntity)
  @JoinTable()
  styleTags: StyleTag[];
  @OneToMany('ShippingAddressEntity', 'user', { cascade: true })
  shippingAddresses: IShippingAddress[];
  @OneToOne('RefundAccountEntity', 'user', { nullable: true, cascade: true })
  @JoinColumn()
  refundAccount: IRefundAccount;

  // queue에서 계산해서 update하는 값들
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'int', unsigned: true, default: 0 })
  followCount: number;

  // model only fields
  @Field({ description: '[MODEL ONLY]', nullable: true })
  isFollowing: boolean;
  @Field({ description: '[MODEL ONLY]', nullable: true })
  isMe: boolean;
}
