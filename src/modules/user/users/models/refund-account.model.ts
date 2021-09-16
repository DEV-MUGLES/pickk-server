import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { RefundAccountEntity } from '../entities';

import { User } from './user.model';

@ObjectType({
  description: '가상계좌 결제시 환불 받을 계좌 정보',
})
export class RefundAccount extends RefundAccountEntity {
  @Type(() => User)
  @Field(() => User)
  user: User;
}
