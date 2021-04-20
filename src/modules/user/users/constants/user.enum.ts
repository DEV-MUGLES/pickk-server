import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  User = 'user',
  Editor = 'editor',
  Seller = 'seller',
  Admin = 'admin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description:
    '유저의 역할/권한을 나타냅니다. User->Editor->Seller->Admin 순으로 계층 구조입니다.',
});

export enum UserOauthProvider {
  Facebook = 'facebook',
  Kakao = 'kakao',
  Apple = 'apple',
}

registerEnumType(UserOauthProvider, {
  name: 'UserProviderType',
  description: 'Oauth 제공 서비스입니다.',
});
