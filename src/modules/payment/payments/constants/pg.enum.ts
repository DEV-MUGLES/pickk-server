import { registerEnumType } from '@nestjs/graphql';

export enum Pg {
  Inicis = 'inicis',
}

registerEnumType(Pg, {
  name: 'Pg',
  description: 'PG사입니다.',
});
