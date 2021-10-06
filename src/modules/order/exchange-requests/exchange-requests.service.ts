import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { ProductsService } from '@item/products/products.service';
import { EXCHANGE_ORDER_ITEM_RELATIONS } from '@order/order-items/constants';
import { OrderItemsService } from '@order/order-items/order-items.service';
import { PaymentsService } from '@payment/payments/payments.service';

import { ExchangeRequestRelationType } from './constants';
import { ExchangeRequestFilter, RegisterExchangeRequestInput } from './dtos';
import { InvalidExchangeShippingFeeException } from './exceptions';
import { ExchangeRequestFactory } from './factories';
import { ExchangeRequest } from './models';

import { ExchangeRequestsRepository } from './exchange-requests.repository';

@Injectable()
export class ExchangeRequestsService {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository,
    private readonly orderItemsService: OrderItemsService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService
  ) {}

  async get(
    merchantUid: string,
    relations: ExchangeRequestRelationType[] = []
  ): Promise<ExchangeRequest> {
    return await this.exchangeRequestsRepository.get(merchantUid, relations);
  }

  async list(
    exchangeRequestFilter?: ExchangeRequestFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<ExchangeRequest[]> {
    const _exchangeRequestFilter = plainToClass(
      ExchangeRequestFilter,
      exchangeRequestFilter
    );
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.exchangeRequestsRepository.entityToModelMany(
      await this.exchangeRequestsRepository.find({
        relations,
        where: parseFilter(_exchangeRequestFilter, _pageInput?.idFilter),
        order: {
          merchantUid: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async markReshipped(merchantUid: string): Promise<ExchangeRequest> {
    const exchangeRequest = await this.get(merchantUid, ['orderItem']);
    exchangeRequest.markReshipped();

    return await this.exchangeRequestsRepository.save(exchangeRequest);
  }

  async register(
    merchantUid: string,
    input: RegisterExchangeRequestInput
  ): Promise<ExchangeRequest> {
    const orderItem = await this.orderItemsService.get(
      merchantUid,
      EXCHANGE_ORDER_ITEM_RELATIONS
    );
    const product = await this.productsService.get(input.productId, [
      'item',
      'itemOptionValues',
    ]);

    const exchangeRequest = ExchangeRequestFactory.create(
      orderItem,
      product,
      input
    );
    return await this.exchangeRequestsRepository.save(exchangeRequest);
  }

  async complete(merchantUid: string) {
    const exchangeRequest = await this.get(merchantUid, [
      'orderItem',
      ...(EXCHANGE_ORDER_ITEM_RELATIONS.map(
        (v) => 'orderItem.' + v
      ) as ExchangeRequestRelationType[]),
    ]);

    if (exchangeRequest.shippingFee > 0) {
      // 무료배송이 아닌 경우 결제 검증
      const payment = await this.paymentsService.get(merchantUid);
      if (payment.amount !== exchangeRequest.shippingFee) {
        throw new InvalidExchangeShippingFeeException(
          exchangeRequest,
          payment.amount
        );
      }
    }

    exchangeRequest.markRequested();

    return await this.exchangeRequestsRepository.save(exchangeRequest);
  }
}
