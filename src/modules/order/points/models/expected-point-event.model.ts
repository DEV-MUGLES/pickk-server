import { ObjectType } from '@nestjs/graphql';

import { ExpectedPointEventEntity } from '../entities';

@ObjectType()
export class ExpectedPointEvent extends ExpectedPointEventEntity {
  public static getAmountCacheKey(userId: number): string {
    return `epeA:${userId}`;
  }
}
