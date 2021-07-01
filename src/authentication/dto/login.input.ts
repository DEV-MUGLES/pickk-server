import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '@user/users/constants/user.enum';
import { User } from '@user/users/models/user.model';
import { AppleClientType } from '@providers/apple/apple.enum';

@InputType()
export class LoginByCodeInput extends PickType(User, ['code'], InputType) {
  @Field()
  password: string;

  @Field(() => UserRole, {
    defaultValue: UserRole.User,
    description:
      '로그인에 필요한 최소 권한입니다. (ex: Seller로 설정 시 Seller, Admin일때만 성공)',
  })
  @IsEnum(UserRole)
  @IsOptional()
  minRole?: UserRole;
}

@InputType()
export class LoginByOauthInput extends PickType(
  User,
  ['oauthProvider', 'oauthCode'],
  InputType
) {
  @Field(() => UserRole, {
    defaultValue: UserRole.User,
    description:
      '로그인에 필요한 최소 권한입니다. (ex: Seller로 설정 시 Seller, Admin일때만 성공)',
  })
  @IsEnum(UserRole)
  @IsOptional()
  minRole?: UserRole;
}

@InputType()
export class LoginWithAppleInput {
  @Field()
  @IsString()
  code: string;

  @Field(() => AppleClientType)
  @IsEnum(AppleClientType)
  clientType: AppleClientType;
}
