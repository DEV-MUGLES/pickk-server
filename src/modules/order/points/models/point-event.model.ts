import { ObjectType } from '@nestjs/graphql';

import { PointType } from '../constants';
import { CreateEventInput } from '../dtos';
import { PointEventEntity } from '../entities';
import {
  AddPointTypeAmountInvalidException,
  NotEnoughPointAmountException,
  SubPointTypeAmountInvalidException,
} from '../exceptions';

@ObjectType()
export class PointEvent extends PointEventEntity {
  public static getAmountCacheKey(userId: number): string {
    return `point-amount:${userId}`;
  }

  public static of(
    createEventInput: CreateEventInput,
    currentAmount: number
  ): PointEvent {
    const { amount: diff, type } = createEventInput;
    if (type === PointType.Add && diff < 0) {
      throw new AddPointTypeAmountInvalidException();
    }
    if (type === PointType.Sub && diff > 0) {
      throw new SubPointTypeAmountInvalidException();
    }

    const resultAmount = currentAmount + diff;
    if (resultAmount < 0) {
      throw new NotEnoughPointAmountException();
    }

    return new PointEvent({ ...createEventInput, resultBalance: resultAmount });
  }
}
