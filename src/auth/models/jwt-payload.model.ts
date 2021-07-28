import { ObjectType, Field, Int } from '@nestjs/graphql';

import { IJwtPayload } from '@auth/interfaces';
import { Timestamp } from '@common/scalars';

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
