import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis/provider.service';

import {
  PointEventFilter,
  CreateEventInput,
  CreateExpectedPointEventInput,
} from './dtos';
import { ExpectedPointEvent, PointEvent } from './models';
import {
  ExpectedPointEventsRepository,
  PointEventsRepository,
} from './points.repository';
import { ExpectedPointEventProducer } from './producers';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEventsRepository)
    private readonly pointEventsRepository: PointEventsRepository,
    @InjectRepository(ExpectedPointEventsRepository)
    private readonly expectedpointEventsRepository: ExpectedPointEventsRepository,
    private cacheService: CacheService,
    private readonly expectedPointEventProducer: ExpectedPointEventProducer
  ) {}

  async updateAvailableAmount(userId: number, amount: number) {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    this.cacheService.set<number>(cacheKey, amount);
  }

  async getAvailableAmount(userId: number, isUpdatingCache = true) {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    const cachedCount = await this.cacheService.get<number>(cacheKey);

    if (cachedCount != null) {
      return Number(cachedCount);
    }

    const amount = await this.pointEventsRepository.getSum(userId);

    if (isUpdatingCache) {
      this.cacheService.set<number>(cacheKey, amount);
    }
    return Number(amount);
  }

  async getExpectedAmount(userId: number, isUpdatingCache = true) {
    const cacheKey = ExpectedPointEvent.getAmountCacheKey(userId);
    const cachedCount = await this.cacheService.get<number>(cacheKey);

    if (cachedCount != null) {
      return cachedCount;
    }

    const amount = await this.expectedpointEventsRepository.getSum(userId);

    if (isUpdatingCache) {
      this.cacheService.set<number>(cacheKey, amount);
    }
    return amount;
  }

  async listEvents(
    pointEventFilter?: PointEventFilter,
    pageInput?: PageInput
  ): Promise<PointEvent[]> {
    const _pointEventFilter = plainToClass(PointEventFilter, pointEventFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.pointEventsRepository.entityToModelMany(
      await this.pointEventsRepository.find({
        where: parseFilter(_pointEventFilter, _pageInput?.idFilter),
        order: {
          id: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async listExpectedEvents(
    pointEventFilter?: PointEventFilter,
    pageInput?: PageInput
  ): Promise<ExpectedPointEvent[]> {
    const _pointEventFilter = plainToClass(PointEventFilter, pointEventFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.expectedpointEventsRepository.entityToModelMany(
      await this.expectedpointEventsRepository.find({
        where: parseFilter(_pointEventFilter, _pageInput?.idFilter),
        order: {
          id: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async createEvent(input: CreateEventInput): Promise<number> {
    const { userId, orderItemMerchantUid } = input;
    const currentAmount = await this.getAvailableAmount(userId);
    const pointEvent = PointEvent.of(input, currentAmount);

    await this.updateAvailableAmount(userId, pointEvent.resultBalance);
    const createdPointEvent = await this.pointEventsRepository.save(pointEvent);

    if (orderItemMerchantUid) {
      this.expectedPointEventProducer.removeByOrderItemUid(
        orderItemMerchantUid
      );
    }

    return createdPointEvent.resultBalance;
  }

  async createExpectedEvent(
    createExpectedPointEventInput: CreateExpectedPointEventInput
  ): Promise<ExpectedPointEvent> {
    const expectedPointEvent = new ExpectedPointEvent(
      createExpectedPointEventInput
    );
    return await this.expectedpointEventsRepository.save(expectedPointEvent);
  }

  async removeExpectedEvent(orderItemMerchantUid: string): Promise<void> {
    const expectedPointEvent =
      await this.expectedpointEventsRepository.findOneEntity({
        orderItemMerchantUid,
      });
    await this.expectedpointEventsRepository.remove(expectedPointEvent);
  }
}
