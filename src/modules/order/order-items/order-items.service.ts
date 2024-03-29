import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis';

import { OrderItemRelationType } from './constants';
import { BulkUpdateOrderItemInput, OrderItemFilter } from './dtos';
import { OrderItem } from './models';
import { OrderItemsProducer } from './producers';

import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly orderItemsProducer: OrderItemsProducer,
    private readonly cacheService: CacheService
  ) {}

  async get(
    merchantUid: string,
    relations: OrderItemRelationType[] = []
  ): Promise<OrderItem> {
    return await this.orderItemsRepository.get(merchantUid, relations);
  }

  async list(
    orderItemFilter?: OrderItemFilter,
    pageInput?: PageInput,
    relations: OrderItemRelationType[] = []
  ): Promise<OrderItem[]> {
    const _orderItemFilter = plainToClass(OrderItemFilter, orderItemFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.orderItemsRepository.entityToModelMany(
      await this.orderItemsRepository.find({
        relations,
        where: parseFilter(_orderItemFilter, _pageInput?.idFilter),
        order: {
          merchantUid: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async checkBelongsTo(merchantUid: string, userId: number) {
    const isMine = await this.orderItemsRepository.checkBelongsTo(
      merchantUid,
      userId
    );
    if (!isMine) {
      throw new ForbiddenException('자신의 주문상품이 아닙니다.');
    }
  }

  async confirm(merchantUid: string) {
    const orderItem = await this.get(merchantUid);
    orderItem.confirm();

    await this.orderItemsProducer.giveReward(merchantUid);
    await this.orderItemsProducer.indexOrderItems([merchantUid]);
    return await this.orderItemsRepository.save(orderItem);
  }

  ////////////////////////////
  // active count 관련 함수들 //
  ///////////////////////////

  getActivesCountCacheKey(userId: number): string {
    return `user:${userId}:active-order-items-count`;
  }

  async getActivesCount(userId: number): Promise<number> {
    const cacheKey = this.getActivesCountCacheKey(userId);
    const cached = await this.cacheService.get<number>(cacheKey);
    if (cached) {
      return Number(cached);
    }

    return this.reloadActivesCount(userId);
  }

  async reloadActivesCount(userId: number): Promise<number> {
    const count = await this.orderItemsRepository.countActive(userId);

    const cacheKey = this.getActivesCountCacheKey(userId);
    this.cacheService.set(cacheKey, count, { ttl: 600 });

    return count;
  }

  async bulkUpdate(
    merchantUids: string[],
    input: BulkUpdateOrderItemInput
  ): Promise<OrderItem[]> {
    const orderItems = await this.list({ merchantUidIn: merchantUids });

    return await this.orderItemsRepository.save(
      orderItems.map((v) => new OrderItem({ ...v, ...input }))
    );
  }
}
