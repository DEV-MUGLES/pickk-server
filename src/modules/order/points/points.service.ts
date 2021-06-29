import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { DeleteResult } from 'typeorm';

import { PageInput } from '@common/dtos/pagination.dto';
import { parseFilter } from '@common/helpers/filter.helpers';
import { CacheService } from '@providers/cache/redis/provider.service';

import { PointEventFilter } from './dtos/point-event.filter';
import { ExpectedPointEvent, PointEvent } from './models';
import {
  ExpectedPointEventsRepository,
  PointEventsRepository,
} from './points.repository';
import { PointType } from './constants/points.enum';
import { SubtractPointEventInput } from './dtos/point-event.dto';
import { AddExpectedPointEventInput } from './dtos/expected-point-event.dto';
import { ForbiddenPointSubtractEventExeption } from './exceptions/point.exception';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEventsRepository)
    private readonly pointEventsRepository: PointEventsRepository,
    @InjectRepository(ExpectedPointEventsRepository)
    private readonly expectedpointEventsRepository: ExpectedPointEventsRepository,
    @Inject(CacheService) private cacheService: CacheService
  ) {}

  async updateAvailableAmountByUserId(userId: number, amount: number) {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    this.cacheService.set<number>(cacheKey, amount);
  }

  async getAvailableAmountByUserId(userId: number, isUpdatingCache = true) {
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

  async getExpectedAmountByUserId(userId: number, isUpdatingCache = true) {
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

  async subtractEvent(
    subtractPointEventInput: SubtractPointEventInput
  ): Promise<PointEvent> {
    const { userId, amount } = subtractPointEventInput;
    const prevResultBalance = await this.getAvailableAmountByUserId(userId);
    const resultBalance = prevResultBalance + amount;

    if (resultBalance < 0) {
      throw new ForbiddenPointSubtractEventExeption();
    }

    const pointEvent = new PointEvent({
      ...subtractPointEventInput,
      resultBalance,
      type: PointType.Sub,
    });

    await this.updateAvailableAmountByUserId(userId, resultBalance);
    return await this.pointEventsRepository.save(pointEvent);
  }

  async addEvent(
    userId: number,
    expectedPointEventId: number
  ): Promise<PointEvent> {
    const expectedPointEvent = await this.expectedpointEventsRepository.get(
      expectedPointEventId
    );
    const prevResultBalance = await this.getAvailableAmountByUserId(userId);
    const resultBalance = prevResultBalance + expectedPointEvent.amount;
    const pointEvent = new PointEvent({
      ...expectedPointEvent,
      resultBalance,
      type: PointType.Add,
    });

    await this.updateAvailableAmountByUserId(userId, resultBalance);
    await this.removeExpectedEvent(expectedPointEventId);
    return await this.pointEventsRepository.save(pointEvent);
  }

  async addExpectedEvent(
    addExpectedPointEventInput: AddExpectedPointEventInput
  ): Promise<ExpectedPointEvent> {
    const expectedPointEvent = new ExpectedPointEvent(
      addExpectedPointEventInput
    );
    return await this.expectedpointEventsRepository.save(expectedPointEvent);
  }

  async removeExpectedEvent(id: number): Promise<DeleteResult> {
    return await this.expectedpointEventsRepository.delete(id);
  }
}
