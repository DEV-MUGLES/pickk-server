import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from '@item/products/models';
import { ExchanteRequestFactory } from '@order/exchange-requests/factories';

import { RequestOrderItemExchangeInput } from './dtos';
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

  async requestExchange(
    orderItem: OrderItem,
    product: Product,
    input: RequestOrderItemExchangeInput
  ): Promise<OrderItem> {
    orderItem.requestExchange(
      ExchanteRequestFactory.create(
        orderItem.userId,
        product,
        input,
        orderItem.quantity
      )
    );
    return await this.orderItemsRepository.save(orderItem);
  }
}
