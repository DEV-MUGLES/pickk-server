import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';

import { RefundRequestsCountOutput } from './dtos';

@Injectable()
export class SellerRefundRequestService {
  constructor(
    @InjectRepository(RefundRequestsRepository)
    private readonly refundRequestsRepository: RefundRequestsRepository
  ) {}

  async getCount(sellerId: number): Promise<RefundRequestsCountOutput> {
    const refundRequests = await this.refundRequestsRepository.find({
      select: ['status'],
      where: {
        sellerId,
        requestedAt: MoreThanOrEqual(dayjs().subtract(1, 'month').toDate()),
      },
    });

    return RefundRequestsCountOutput.create(sellerId, refundRequests);
  }
}
