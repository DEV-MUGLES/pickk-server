import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { User } from '@user/users/models';

import { RewardEventEntity } from '../entities';
import { OrderItem } from '@order/order-items/models';
import { Digest } from '@content/digests/models';

@ObjectType()
export class RewardEvent extends RewardEventEntity {
  public static getAmountCacheKey(userId: number): string {
    return `reward-amount:${userId}`;
  }

  @Field(() => User)
  @Type(() => User)
  user: User;
  @Field(() => Digest, { nullable: true })
  @Type(() => Digest)
  recommendDigest: Digest;
  @Field(() => OrderItem)
  @Type(() => OrderItem)
  orderItem: OrderItem;
}
