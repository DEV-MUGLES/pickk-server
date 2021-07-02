import { ObjectType } from '@nestjs/graphql';

import { PointType } from '../constants/points.enum';
import { CreateEventInput } from '../dtos/point-event.dto';
import { PointEventEntity } from '../entities/point-event.entity';
import {
  AddPointTypeAmountInvalidException,
  NotEnoughPointAmountException,
  SubPointTypeAmountInvalidException,
} from '../exceptions/point.exceptions';

@ObjectType()
export class PointEvent extends PointEventEntity {
  public static getAmountCacheKey(userId: number): string {
    return `peA:${userId}`;
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
