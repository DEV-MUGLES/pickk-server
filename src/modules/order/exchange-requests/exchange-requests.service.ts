import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { ProductsService } from '@item/products/products.service';
import { EXCHANGE_ORDER_ITEM_RELATIONS } from '@order/order-items/constants';
import { OrderItemsProducer } from '@order/order-items/producers';
import { OrderItemsService } from '@order/order-items/order-items.service';
import { OrdersService } from '@order/orders/orders.service';
import { PaymentsService } from '@payment/payments/payments.service';

import { ExchangeRequestRelationType } from './constants';
import { ExchangeRequestFilter, RegisterExchangeRequestInput } from './dtos';
import { InvalidExchangeShippingFeeException } from './exceptions';
import { ExchangeRequestFactory } from './factories';
import { ExchangeRequestsProducer } from './producers';
import { ExchangeRequest } from './models';

import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';

@Injectable()
export class ExchangeRequestsService {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository,
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly orderItemsProducer: OrderItemsProducer,
    private readonly exchangeRequestProducer: ExchangeRequestsProducer
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

  async markReshipped(merchantUid: string): Promise<void> {
    const exchangeRequest = await this.get(merchantUid, ['orderItem']);
    exchangeRequest.markReshipped();

    await this.exchangeRequestsRepository.save(exchangeRequest);
    await this.orderItemsProducer.indexOrderItems([merchantUid]);
    await this.exchangeRequestProducer.indexExchangeRequests([
      exchangeRequest.merchantUid,
    ]);
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

    const exchangeRequest = await this.exchangeRequestsRepository.save(
      ExchangeRequestFactory.create(orderItem, product, input)
    );
    await this.exchangeRequestProducer.indexExchangeRequests([
      exchangeRequest.merchantUid,
    ]);
    return exchangeRequest;
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

    await this.exchangeRequestsRepository.save(exchangeRequest);
    await this.orderItemsProducer.indexOrderItems([merchantUid]);
    await this.exchangeRequestProducer.indexExchangeRequests([
      exchangeRequest.merchantUid,
    ]);
  }

  async convert(merchantUid: string) {
    const exchangeRequest = await this.get(merchantUid, ['orderItem']);

    exchangeRequest.markConverted();
    await this.exchangeRequestsRepository.save(exchangeRequest);
    await this.exchangeRequestProducer.indexExchangeRequests([merchantUid]);

    if (exchangeRequest.shippingFee > 0) {
      await this.paymentsService.cancel(merchantUid, {
        reason: '교환신청을 반품신청으로 변경',
        amount: exchangeRequest.shippingFee,
      });
    }

    const { orderItem } = exchangeRequest;
    await this.ordersService.requestRefund(orderItem.orderMerchantUid, {
      orderItemMerchantUids: [orderItem.merchantUid],
      faultOf: OrderClaimFaultOf.Seller,
      reason: '교환신청에서 전환됨',
      shipmentInput: null,
    });
    // @TODO: 고객에게 알림 보내야할듯? 일단 결제했던 배송비가 환불된거니까
    await this.orderItemsProducer.indexOrderItems([orderItem.merchantUid]);
  }
}
