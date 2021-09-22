import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'USER',
  EDITOR = 'EDITOR',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description:
    '유저의 역할/권한을 나타냅니다. USER->EDITOR->SELLER->ADMIN 순으로 계층 구조입니다.',
});

export enum UserOauthProvider {
  FACEBOOK = 'FACEBOOK',
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

registerEnumType(UserOauthProvider, {
  name: 'UserProviderType',
  description: 'Oauth 제공 서비스입니다.',
});
