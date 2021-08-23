import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from '@providers/cache/redis';

import { HitOwnerType } from './constants';
import { getCountMapCacheKey, getEarlyHitCacheKey } from './helpers';
import { HitCountMap } from './types';

@Injectable()
export class HitsService {
  constructor(@Inject(CacheService) private cacheService: CacheService) {}

  async isEarly(
    ownerType: HitOwnerType,
    ownerId: number,
    ipOrId: string
  ): Promise<boolean> {
    const cacheKey = getEarlyHitCacheKey(ownerType, ownerId, ipOrId);
    const cached = await this.cacheService.get<number>(cacheKey);

    if (cached) {
      return true;
    } else {
      await this.cacheService.set<number>(cacheKey, 1, { ttl: 300 });
      return false;
    }
  }

  async add(ownerType: HitOwnerType, ownerId: number): Promise<void> {
    const cacheKey = getCountMapCacheKey(ownerType);
    const countMap = await this.getOwnerCountMap(ownerType);

    await this.cacheService.set(cacheKey, {
      ...countMap,
      [ownerId]: (countMap[ownerId] || 0) + 1,
    });
  }

  async clearOwnerCountMap(ownerType: HitOwnerType): Promise<void> {
    const cacheKey = getCountMapCacheKey(ownerType);

    await this.cacheService.set(cacheKey, {});
  }

  async getOwnerCountMap(ownerType: HitOwnerType): Promise<HitCountMap> {
    const cacheKey = getCountMapCacheKey(ownerType);

    return (await this.cacheService.get<HitCountMap>(cacheKey)) ?? {};
  }
}
