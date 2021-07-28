import { ObjectType, Field } from '@nestjs/graphql';

import { IJwtToken } from '@auth/interfaces';

@ObjectType()
export class JwtToken implements IJwtToken {
  @Field()
  access: string;

  @Field()
  refresh: string;
}
