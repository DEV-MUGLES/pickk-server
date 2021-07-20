import { Inject, Injectable } from '@nestjs/common';

import { CacheService } from '@providers/cache/redis/provider.service';

import { OrderSheetInput } from './dtos';
import { UuidNotMatchedException } from './exceptions';
import { OrderSheet } from './models';

@Injectable()
export class OrderSheetsService {
  constructor(@Inject(CacheService) private cacheService: CacheService) {}

  async create(userId: number, input: OrderSheetInput): Promise<OrderSheet> {
    const orderSheet = OrderSheet.from(userId, input);

    const cacheKey = OrderSheet.getCacheKey(userId);
    await this.cacheService.set<OrderSheet>(cacheKey, orderSheet);

    return orderSheet;
  }

  async get(userId: number, uuid?: string): Promise<OrderSheet> {
    const cacheKey = OrderSheet.getCacheKey(userId);
    const orderSheet = await this.cacheService.get<OrderSheet>(cacheKey);

    if (uuid && orderSheet.uuid !== uuid) {
      throw new UuidNotMatchedException();
    }

    return orderSheet;
  }
}
