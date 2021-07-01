import { ObjectType } from '@nestjs/graphql';

import { PointEventEntity } from '../entities/point-event.entity';

@ObjectType()
export class PointEvent extends PointEventEntity {
  public static getAmountCacheKey(userId: number): string {
    return `peA:${userId}`;
  }

  public update(attributes: Partial<PointEvent>) {
    Object.keys(attributes).forEach((key) => {
      if (attributes[key] === undefined) {
        return;
      }
      this[key] = attributes[key];
    });
  }
}
