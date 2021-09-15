import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { ExchangeRequestStatus } from '@order/exchange-requests/constants';
import { ReshipExchangeRequestInput } from '@order/exchange-requests/dtos';
import { ExchangeRequestEntity } from '@order/exchange-requests/entities';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';

import { ExchangeRequestsCountOutput } from './dtos';

@Injectable()
export class SellerExchangeRequestService {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {}

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
    const exchangeRequests = await this.exchangeRequestsRepository.find({
      select: ['merchantUid', 'status', 'sellerId'],
      where: {
        merchantUid: In(merchantUids),
      },
    });

    if (exchangeRequests.some((oi) => oi.sellerId !== sellerId)) {
      const { merchantUid } = exchangeRequests.find(
        (oi) => oi.sellerId !== sellerId
      );
      throw new ForbiddenException(
        `입력된 교환요청 ${merchantUid}에 대한 권한이 없습니다.`
      );
    }

    if (
      exchangeRequests.some(
        (rr) => rr.status !== ExchangeRequestStatus.Requested
      )
    ) {
      const { merchantUid } = exchangeRequests.find(
        (rr) => rr.status !== ExchangeRequestStatus.Requested
      );
      throw new BadRequestException(
        `입력된 교환신청 ${merchantUid}가 요청됨 상태가 아닙니다.`
      );
    }

    await this.exchangeRequestsRepository
      .createQueryBuilder()
      .update(ExchangeRequestEntity)
      .set({ status: ExchangeRequestStatus.Picked, pickedAt: new Date() })
      .where({ merchantUid: In(merchantUids) })
      .execute();
  }

  async reship(
    exchangeRequest: ExchangeRequest,
    input: ReshipExchangeRequestInput
  ) {
    exchangeRequest.reship(input);
    await this.exchangeRequestsRepository.save(exchangeRequest);
  }
}
