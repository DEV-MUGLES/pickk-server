import { registerEnumType } from '@nestjs/graphql';

export enum PayEnviroment {
  Pc = 'pc',
  Mobile = 'mobile',
}

registerEnumType(PayEnviroment, {
  name: 'PayEnviroment',
});
