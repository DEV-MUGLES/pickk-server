import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

import { RefundRequestsCountOutput } from './dtos';

@Injectable()
export class SellerRefundRequestService {
  constructor(
    @InjectRepository(RefundRequestsRepository)
    private readonly refundRequestsRepository: RefundRequestsRepository,
    private readonly refundRequestsService: RefundRequestsService
  ) {}

  async checkBelongsTo(merchantUid: string, sellerId: number): Promise<void> {
    const refundRequest = await this.refundRequestsRepository.findOneOrFail({
      select: ['sellerId'],
      where: { merchantUid },
    });
    if (refundRequest.sellerId !== sellerId) {
      throw new ForbiddenException(
        `반품요청(${merchantUid})에 대한 권한이 없습니다.`
      );
    }
  }

  async getCount(
    sellerId: number,
    month = 3
  ): Promise<RefundRequestsCountOutput> {
    const refundRequests = await this.refundRequestsRepository.find({
      select: ['status', 'isProcessDelaying'],
      where: {
        sellerId,
        requestedAt: MoreThanOrEqual(dayjs().subtract(month, 'month').toDate()),
      },
    });

    return RefundRequestsCountOutput.create(sellerId, refundRequests);
  }

  async bulkPick(sellerId: number, merchantUids: string[]) {
    const refundRequests = await this.refundRequestsService.list({
      merchantUidIn: merchantUids,
    });

    const notMine = refundRequests.find((oi) => oi.sellerId !== sellerId);
    if (notMine) {
      throw new ForbiddenException(
        `반품요청(${notMine.merchantUid})에 대한 권한이 없습니다.`
      );
    }

    refundRequests.forEach((v) => v.markPicked());

    await this.refundRequestsRepository.save(refundRequests);
  }
}
