import { registerEnumType } from '@nestjs/graphql';

export enum PayEnviroment {
  PC = 'PC',
  MOBILE = 'MOBILE',
}

registerEnumType(PayEnviroment, {
  name: 'PayEnviroment',
});
