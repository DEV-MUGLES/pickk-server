import {
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
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
import {
  CreateAddEventInput,
  CreateSubstractEventInput,
} from './dtos/point-event.dto';
import { CreateExpectedPointEventInput } from './dtos/expected-point-event.dto';
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

  async createSubstractEvent(
    createsubstractEventInput: CreateSubstractEventInput
  ): Promise<PointEvent> {
    const { userId, amount: diff } = createsubstractEventInput;
    const currentAmount = await this.getAvailableAmount(userId);
    const resultAmount = currentAmount + diff;

    if (resultAmount < 0) {
      throw new ForbiddenPointSubtractEventExeption();
    }

    const pointEvent = new PointEvent({
      ...createsubstractEventInput,
      resultBalance: resultAmount,
      type: PointType.Sub,
    });

    await this.updateAvailableAmount(userId, resultAmount);
    return await this.pointEventsRepository.save(pointEvent);
  }

  // @TODO: AWS SQS로 orderId에 따라 removeExpectedEvent를 큐에 등록하기
  async createAddEvent(
    createAddEventInput: CreateAddEventInput
  ): Promise<PointEvent> {
    const { userId, amount: diff } = createAddEventInput;
    const currentAmount = await this.getAvailableAmount(userId);
    const resultAmount = currentAmount + diff;
    const pointEvent = new PointEvent({
      ...createAddEventInput,
      resultBalance: resultAmount,
      type: PointType.Add,
    });

    const pointEventResult = await this.pointEventsRepository.save(pointEvent);
    await this.updateAvailableAmount(userId, resultAmount);
    return pointEventResult;
  }

  async createExpectedEvent(
    createExpectedPointEventInput: CreateExpectedPointEventInput
  ): Promise<ExpectedPointEvent> {
    const expectedPointEvent = new ExpectedPointEvent(
      createExpectedPointEventInput
    );
    return await this.expectedpointEventsRepository.save(expectedPointEvent);
  }

  // @TODO: AWS SQS적용해서 업데이트하기
  async removeExpectedEvent(orderId: number): Promise<DeleteResult> {
    return await this.expectedpointEventsRepository.delete(orderId);
  }
}
