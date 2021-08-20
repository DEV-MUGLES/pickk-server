import { ObjectType, Field, Int } from '@nestjs/graphql';

import { IJwtPayload } from '@auth/interfaces';
import { Timestamp } from '@common/scalars';

@ObjectType()
export class JwtPayload implements IJwtPayload {
  constructor(attributes?: Partial<JwtPayload>) {
    if (!attributes) {
      return;
    }

    this.sellerId = attributes.sellerId;
    this.brandId = attributes.brandId;
    this.nickname = attributes.nickname;

    this.sub = attributes.sub;
    this.iat = attributes.iat;
    this.exp = attributes.exp;
  }

  @Field({ nullable: true, description: 'Seller 로그인인 경우에만 발급된다.' })
  sellerId?: number;
  @Field({ nullable: true, description: 'Seller 로그인인 경우에만 발급된다.' })
  brandId?: number;
  @Field()
  nickname: string;

  @Field(() => Int)
  sub: number;
  @Field(() => Timestamp, { description: '발급 시점' })
  iat: number;
  @Field(() => Timestamp, { description: '만료 시점' })
  exp: number;
}
