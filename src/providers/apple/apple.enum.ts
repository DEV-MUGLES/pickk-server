import { registerEnumType } from '@nestjs/graphql';

export enum AppleClientType {
  App = 'App',
  Web = 'Web',
}

registerEnumType(AppleClientType, {
  name: 'AppleClientType',
  description: '애플 로그인시 사용됩니다. [App, Web]',
});
