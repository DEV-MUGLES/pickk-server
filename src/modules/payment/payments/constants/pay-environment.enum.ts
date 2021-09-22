import { registerEnumType } from '@nestjs/graphql';

export enum PayEnviroment {
  Pc = 'Pc',
  Mobile = 'Mobile',
}

registerEnumType(PayEnviroment, {
  name: 'PayEnviroment',
});
