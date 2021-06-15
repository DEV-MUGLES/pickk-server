import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T = unknown>(key: string) {
    // cache server에서 key에 해당하는 value를 가져옵니다.
    return await this.cache.get<T>(key);
  }
  async set<T = unknown>(key: string, value: any, options?: CachingConfig) {
    // cache server에 key-value 형태로 데이터를 저장합니다.
    await this.cache.set<T>(key, value, options);
  }
}
