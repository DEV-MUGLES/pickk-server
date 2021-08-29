import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';

import { BaseStep } from '@batch/jobs/base.step';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestStatus } from '@order/exchange-requests/constants';

@Injectable()
export class ConfirmExchangedOrderItemsStep extends BaseStep {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository,
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {
    super();
  }
  async tasklet() {
    const notConfirmedOrderItemMerchantUids = (
      await this.exchangeRequestsRepository
        .createQueryBuilder('exchangeRequest')
        .select('orderItemMerchantUid')
        .innerJoin(
          'exchangeRequest.orderItem',
          'orderItem',
          'orderItem.isConfirmed = false'
        )
        .where('exchangeRequest.status = :status', {
          status: ExchangeRequestStatus.Reshipped,
        })
        .andWhere('exchangeRequest.reShippedAt < :reShippedAt', {
          reShippedAt: dayjs().add(-14, 'day').toDate(),
        })
        .execute()
    ).map(({ orderItemMerchantUid }) => orderItemMerchantUid);

    await this.orderItemsRepository.update(notConfirmedOrderItemMerchantUids, {
      isConfirmed: true,
    });
  }
}
