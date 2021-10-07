import { BadRequestException } from '@nestjs/common';
import { ObjectType } from '@nestjs/graphql';

import { RewardSign } from '../constants';
import { CreateRewardEventInput } from '../dtos';

import { RewardEvent } from '../models';

@ObjectType()
export class RewardEventFactory {
  public static from(
    input: CreateRewardEventInput,
    currentAmount: number
  ): RewardEvent {
    const { amount: diff, sign } = input;
    if (sign === RewardSign.Plus && diff < 0) {
      throw new BadRequestException();
    }
    if (sign === RewardSign.Minus && diff > 0) {
      throw new BadRequestException();
    }

    const resultAmount = currentAmount + diff;
    if (resultAmount < 0) {
      throw new BadRequestException('수익금 잔액이 충분하지 않습니다.');
    }

    return new RewardEvent({ ...input, resultBalance: resultAmount });
  }
}
