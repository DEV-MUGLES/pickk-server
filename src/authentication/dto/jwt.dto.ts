import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { IJwtToken } from '../interfaces/token.interface';

@ObjectType()
export class JwtToken implements IJwtToken {
  @Field()
  access: string;

  @Field()
  refresh: string;
}

@ObjectType()
export class JwtPayload implements IJwtPayload {
  @Field()
  username: string;

  @Field({ nullable: true })
  code?: string;

  @Field(() => Int)
  sub: number;
}
