import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis';

import { ProductsService } from '@item/products/products.service';
import { InvalidExchangeShippingFeeException } from '@order/exchange-requests/exceptions';
import { PaymentsService } from '@payment/payments/payments.service';

import { EXCHANGE_ORDER_ITEM_RELATIONS } from './constants';
import { OrderItemFilter, RequestOrderItemExchangeInput } from './dtos';
import { OrderItem } from './models';

import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsService: ProductsService,
    private readonly cacheService: CacheService,
    private readonly paymentsService: PaymentsService
  ) {}

  async get(merchantUid: string, relations: string[] = []): Promise<OrderItem> {
    return await this.orderItemsRepository.get(merchantUid, relations);
  }

  async list(
    orderItemFilter?: OrderItemFilter,
    pageInput?: PageInput,
    relations: string[] = []
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

  async requestExchange(
    merchantUid: string,
    input: RequestOrderItemExchangeInput
  ): Promise<OrderItem> {
    const orderItem = await this.get(
      merchantUid,
      EXCHANGE_ORDER_ITEM_RELATIONS
    );
    const product = await this.productsService.get(input.productId, [
      'item',
      'itemOptionValues',
    ]);

    const { exchangeRequest } = orderItem.requestExchange(input, product);

    if (exchangeRequest.shippingFee > 0) {
      // 무료배송이 아닌 경우 결제 검증
      const payment = await this.paymentsService.get(orderItem.merchantUid);
      if (payment.amount !== exchangeRequest.shippingFee) {
        throw new InvalidExchangeShippingFeeException(
          exchangeRequest,
          payment.amount
        );
      }
    }

    return await this.orderItemsRepository.save(orderItem);
  }

  async confirm(merchantUid: string) {
    const orderItem = await this.get(merchantUid);
    orderItem.confirm();

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
}
