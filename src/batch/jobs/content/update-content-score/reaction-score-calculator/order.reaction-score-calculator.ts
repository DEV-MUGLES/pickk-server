import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import {
  getReactionScoreFirstInterval,
  getReactionScoreSecondInterval,
} from '../../helpers';

import { ReactionScoreCalculator } from './reaction-score-calculator';

export class OrderReactionScoreCalculator extends ReactionScoreCalculator {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {
    super();
    this.weight = 0.05;
  }

  async getDiffs(itemId: number) {
    const [firstIntervalStart, firstIntervalEnd] =
      getReactionScoreFirstInterval();
    const [secondIntervalStart, secondIntervalEnd] =
      getReactionScoreSecondInterval();

    const firstOrderDiff = await this.orderItemsRepository.count({
      where: {
        itemId,
        paidAt: Between(firstIntervalStart, firstIntervalEnd),
      },
    });

    const secondeOrderDiff = await this.orderItemsRepository.count({
      where: {
        itemId,
        paidAt: Between(secondIntervalStart, secondIntervalEnd),
      },
    });

    return [firstOrderDiff, secondeOrderDiff];
  }
}
