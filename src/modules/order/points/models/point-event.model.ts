import { ObjectType } from '@nestjs/graphql';

import { PointSign } from '../constants';
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

  public static of(input: CreateEventInput, currentAmount: number): PointEvent {
    const { amount: diff, sign } = input;
    if (sign === PointSign.Plus && diff < 0) {
      throw new AddPointTypeAmountInvalidException();
    }
    if (sign === PointSign.Minus && diff > 0) {
      throw new SubPointTypeAmountInvalidException();
    }

    const resultAmount = currentAmount + diff;
    if (resultAmount < 0) {
      throw new NotEnoughPointAmountException();
    }

    return new PointEvent({ ...input, resultBalance: resultAmount });
  }
}
