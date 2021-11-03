import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  User = 'User',
  Editor = 'Editor',
  Seller = 'Seller',
  Admin = 'Admin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description:
    '유저의 역할/권한을 나타냅니다. User->Editor->Seller->Admin 순으로 계층 구조입니다.',
});

export enum UserOauthProvider {
  Facebook = 'Facebook',
  Kakao = 'Kakao',
  Apple = 'Apple',
}

registerEnumType(UserOauthProvider, {
  name: 'UserProviderType',
  description: 'Oauth 제공 서비스입니다.',
});

export enum UserMainChannel {
  Youtube = 'Youtube',
  Instagram = 'Instagram',
  NaverBlog = 'NaverBlog',
}

registerEnumType(UserMainChannel, {
  name: 'UserMainChannel',
});
