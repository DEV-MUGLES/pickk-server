import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { Product } from '@item/products/models';
import { ExchanteRequestFactory } from '@order/exchange-requests/factories';

import { OrderItemFilter, RequestOrderItemExchangeInput } from './dtos';
import { OrderItem } from './models';

import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
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

  async requestExchange(
    orderItem: OrderItem,
    product: Product,
    input: RequestOrderItemExchangeInput
  ): Promise<OrderItem> {
    orderItem.requestExchange(
      ExchanteRequestFactory.create(
        orderItem.userId,
        orderItem.sellerId,
        product,
        input,
        orderItem.quantity
      )
    );
    return await this.orderItemsRepository.save(orderItem);
  }
}
