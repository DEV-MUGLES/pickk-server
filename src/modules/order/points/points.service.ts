import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos/pagination.dto';
import { parseFilter } from '@common/helpers/filter.helpers';
import { CacheService } from '@providers/cache/redis/provider.service';

import { PointEventFilter } from './dtos/point-event.filter';
import { PointEvent } from './models/point-event.model';
import { PointEventsRepository } from './points.repository';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEventsRepository)
    private readonly pointEventsRepository: PointEventsRepository,
    @Inject(CacheService) private cacheService: CacheService
  ) {}

  async getAvailableAmountByUserId(userId: number, isUpdatingCache = true) {
    const cacheKey = PointEvent.getAmountCacheKey(userId);
    const cachedCount = await this.cacheService.get<number>(cacheKey);

    if (cachedCount != null) {
      return cachedCount;
    }

    const amount = await this.pointEventsRepository.getSum(userId);

    if (isUpdatingCache) {
      this.cacheService.set<number>(cacheKey, amount);
    }
    return amount;
  }

  async list(
    couponFilter?: PointEventFilter,
    pageInput?: PageInput
  ): Promise<PointEvent[]> {
    const _couponFilter = plainToClass(PointEventFilter, couponFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.pointEventsRepository.entityToModelMany(
      await this.pointEventsRepository.find({
        where: parseFilter(_couponFilter, pageInput?.idFilter),
        order: {
          id: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }
}
