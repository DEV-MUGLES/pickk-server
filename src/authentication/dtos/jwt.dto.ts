import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';

import { Timestamp } from '@common/scalars';

import { IJwtPayload, IJwtToken } from '../interfaces';

@ObjectType()
export class JwtToken implements IJwtToken {
  @Field()
  access: string;

  @Field()
  refresh: string;
}

@ObjectType()
export class JwtPayload implements IJwtPayload {
  @Field({ nullable: true, description: 'Seller 로그인인 경우에만 발급된다.' })
  sellerId?: number;

  @Field({ nullable: true, description: 'Seller 로그인인 경우에만 발급된다.' })
  brandId?: number;

  @Field()
  nickname: string;

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
]) {}
