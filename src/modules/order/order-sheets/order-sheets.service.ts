import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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

  /** orderSheet을 반환합니다. uuid를 입력하면 검증하고 아니면 그대로 반환합니다. */
  async get(userId: number, uuid?: string): Promise<OrderSheet> {
    const cacheKey = OrderSheet.getCacheKey(userId);
    const orderSheet = await this.cacheService.get<OrderSheet>(cacheKey);
    if (!orderSheet) {
      throw new NotFoundException('OrderSheet이 존재하지 않습니다.');
    }

    if (uuid && orderSheet.uuid !== uuid) {
      throw new UuidNotMatchedException();
    }

    return orderSheet;
  }
}
