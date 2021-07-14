import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '@providers/cache/redis/provider.service';

import { OrderSheetInput } from './dtos';
import { OrderSheet } from './models/order-sheet.model';

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

  async get(userId: number, orderSheetUuid): Promise<OrderSheet> {
    const cacheKey = OrderSheet.getCacheKey(userId);
    const orderSheet = await this.cacheService.get<OrderSheet>(cacheKey);

    if (orderSheet?.uuid === orderSheetUuid) {
      return orderSheet;
    } else {
      throw new NotFoundException('일치하는 OrderSheet이 존재하지 않습니다.');
    }
  }
}
