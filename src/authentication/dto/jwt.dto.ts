import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Timestamp } from '@src/common/scalars/timestamp.scalar';
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
  nickname: string;

  @Field({ nullable: true })
  code?: string;

  @Field(() => Int)
  sub: number;

  @Field(() => Timestamp)
  iat: number;

  @Field(() => Timestamp)
  exp: number;
}

export class CreateJwtPayloadInput extends OmitType(JwtPayload, [
  'iat',
  'exp',
]) {
  nickname: string;
  code?: string;
  sub: number;
}
