import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';

import { BaseStep } from '@batch/jobs/base.step';

import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestStatus } from '@order/exchange-requests/constants';
import { OrderItemsService } from '@order/order-items/order-items.service';

@Injectable()
export class ConfirmExchangedOrderItemsStep extends BaseStep {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository,
    private readonly orderItemsService: OrderItemsService
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
          reShippedAt: dayjs().subtract(7, 'day').toDate(),
        })
        .execute()
    ).map(({ orderItemMerchantUid }) => orderItemMerchantUid);

    for (const merchantUid of notConfirmedOrderItemMerchantUids) {
      await this.orderItemsService.confirm(merchantUid);
    }
  }
}
