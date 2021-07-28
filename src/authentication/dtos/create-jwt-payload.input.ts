import { OmitType } from '@nestjs/graphql';

import { JwtPayload } from '@auth/models';

export class CreateJwtPayloadInput extends OmitType(JwtPayload, [
  'iat',
  'exp',
]) {}
