import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';

import { ExchangeRequestsCountOutput } from './dtos';

@Injectable()
export class SellerExchangeRequestService {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {}

  async getCount(sellerId: number): Promise<ExchangeRequestsCountOutput> {
    const exchangeRequests = await this.exchangeRequestsRepository.find({
      select: ['status'],
      where: {
        sellerId,
        requestedAt: MoreThanOrEqual(dayjs().subtract(1, 'month').toDate()),
      },
    });

    return ExchangeRequestsCountOutput.create(sellerId, exchangeRequests);
  }
}
