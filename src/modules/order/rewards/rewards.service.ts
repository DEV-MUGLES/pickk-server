import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '@providers/cache/redis';
import { CreateRewardEventInput } from './dtos';
import { RewardEventFactory } from './factories';

import { RewardEvent } from './models';

import { RewardEventsRepository } from './rewards.repository';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(RewardEventsRepository)
    private readonly rewardEventsRepository: RewardEventsRepository,
    private cacheService: CacheService
  ) {}

  async checkExist(orderItemMerchantUid: string) {
    const existing = await this.rewardEventsRepository.findOne({
      select: ['id'],
      where: {
        orderItemMerchantUid,
      },
    });

    return existing != null;
  }

  async getAmount(userId: number): Promise<number> {
    const cacheKey = RewardEvent.getAmountCacheKey(userId);
    const cached = await this.cacheService.get<number>(cacheKey);

    if (cached != null) {
      return Number(cached);
    }

    return await this.reloadAmount(userId);
  }

  async reloadAmount(userId: number): Promise<number> {
    const cacheKey = RewardEvent.getAmountCacheKey(userId);
    const amount = await this.rewardEventsRepository.getSum(userId);

    this.cacheService.set<number>(cacheKey, amount);
    return amount;
  }

  async create(input: CreateRewardEventInput): Promise<number> {
    const currentAmount = await this.reloadAmount(input.userId);

    const rewardEvent = RewardEventFactory.from(input, currentAmount);
    await this.rewardEventsRepository.save(rewardEvent);

    return await this.reloadAmount(input.userId);
  }
}
