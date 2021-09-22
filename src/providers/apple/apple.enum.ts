import { registerEnumType } from '@nestjs/graphql';

export enum AppleClientType {
  APP = 'APP',
  WEB = 'WEB',
}

registerEnumType(AppleClientType, {
  name: 'AppleClientType',
  description: '애플 로그인시 사용됩니다. [APP, WEB]',
});
