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

  async updateAmount(userId: number, amount: number) {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    this.cacheService.set<number>(cacheKey, amount);
  }

  async getAmount(userId: number): Promise<number> {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    const cached = await this.cacheService.get<number>(cacheKey);

    if (cached != null) {
      return Number(cached);
    }

    return await this.reloadAmount(userId);
  }

  async reloadAmount(userId: number): Promise<number> {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    const amount = await this.pointEventsRepository.getSum(userId);

    this.cacheService.set<number>(cacheKey, amount);
    return amount;
  }

  async getExpectedAmount(userId: number) {
    const cacheKey = ExpectedPointEvent.getAmountCacheKey(userId);
    const cached = await this.cacheService.get<number>(cacheKey);

    if (cached != null) {
      return Number(cached);
    }

    return await this.reloadExpectedAmount(userId);
  }

  async reloadExpectedAmount(userId: number): Promise<number> {
    const cacheKey = ExpectedPointEvent.getAmountCacheKey(userId);
    const amount = await this.expectedpointEventsRepository.getSum(userId);

    this.cacheService.set<number>(cacheKey, amount);
    return amount;
  }

  async list(
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

  async listExpected(
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

  async create(input: CreateEventInput): Promise<number> {
    const currentAmount = await this.reloadAmount(input.userId);

    const pointEvent = PointEvent.of(input, currentAmount);
    await this.pointEventsRepository.save(pointEvent);

    if (input.orderItemMerchantUid) {
      this.expectedPointEventProducer.removeByOrderItemUid(
        input.orderItemMerchantUid
      );
    }

    return await this.reloadAmount(input.userId);
  }

  async createExpected(input: CreateExpectedPointEventInput): Promise<number> {
    const expected = new ExpectedPointEvent(input);
    await this.expectedpointEventsRepository.save(expected);
    return await this.reloadExpectedAmount(input.userId);
  }

  async removeExpected(orderItemMerchantUid: string): Promise<number> {
    const expected = await this.expectedpointEventsRepository.findOneEntity({
      orderItemMerchantUid,
    });
    if (!expected) {
      return;
    }
    await this.expectedpointEventsRepository.remove(expected);
    return await this.reloadExpectedAmount(expected.userId);
  }
}
