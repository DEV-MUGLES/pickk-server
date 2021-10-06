import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { ReshipExchangeRequestInput } from '@order/exchange-requests/dtos';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';

import { ExchangeRequestsCountOutput } from './dtos';

@Injectable()
export class SellerExchangeRequestService {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository,
    private readonly exchangeRequestsService: ExchangeRequestsService
  ) {}

  async checkBelongsTo(merchantUid: string, sellerId: number) {
    const exchangeRequests = await this.exchangeRequestsRepository.findOne({
      select: ['sellerId'],
      where: { merchantUid },
    });
    if (exchangeRequests?.sellerId !== sellerId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
  }

  async getCount(
    sellerId: number,
    month = 3
  ): Promise<ExchangeRequestsCountOutput> {
    const exchangeRequests = await this.exchangeRequestsRepository.find({
      select: ['status', 'isProcessDelaying'],
      where: {
        sellerId,
        requestedAt: MoreThanOrEqual(dayjs().subtract(month, 'month').toDate()),
      },
    });

    return ExchangeRequestsCountOutput.create(sellerId, exchangeRequests);
  }

  async bulkPick(sellerId: number, merchantUids: string[]) {
    const exchangeRequests = await this.exchangeRequestsService.list({
      merchantUidIn: merchantUids,
    });

    const notMine = exchangeRequests.find((oi) => oi.sellerId !== sellerId);
    if (notMine) {
      throw new ForbiddenException(
        `교환요청(${notMine.merchantUid})에 대한 권한이 없습니다.`
      );
    }

    exchangeRequests.forEach((v) => v.markPicked());

    await this.exchangeRequestsRepository.save(exchangeRequests);
  }

  async reship(merchantUid: string, input: ReshipExchangeRequestInput) {
    const exchangeRequest = await this.exchangeRequestsService.get(
      merchantUid,
      ['orderItem']
    );
    exchangeRequest.reship(input);
    await this.exchangeRequestsRepository.save(exchangeRequest);
  }
}
