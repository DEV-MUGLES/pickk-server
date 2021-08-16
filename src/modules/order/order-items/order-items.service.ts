import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { ProductsService } from '@item/products/products.service';

import { EXCHANGE_ORDER_ITEM_RELATIONS } from './constants';
import { OrderItemFilter, RequestOrderItemExchangeInput } from './dtos';
import { OrderItem } from './models';

import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrderItemsService {
  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
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

  async checkBelongsTo(merchantUid: string, userId: number): Promise<boolean> {
    return await this.orderItemsRepository.checkBelongsTo(merchantUid, userId);
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

    orderItem.requestExchange(input, product);
    return await this.orderItemsRepository.save(orderItem);
  }
}
