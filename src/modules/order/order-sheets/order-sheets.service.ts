import { Inject, Injectable } from '@nestjs/common';

import { CacheService } from '@providers/cache/redis/provider.service';

import { OrderSheetInput } from './dtos';
import { OrderSheet } from './models';

@Injectable()
export class OrderSheetsService {
  constructor(@Inject(CacheService) private cacheService: CacheService) {}

  async createOrderSheet(
    userId: number,
    input: OrderSheetInput
  ): Promise<OrderSheet> {
    const orderSheet = OrderSheet.from(userId, input);

    const cacheKey = OrderSheet.getCacheKey(userId);
    await this.cacheService.set<OrderSheet>(cacheKey, orderSheet);

    return orderSheet;
  }
}
