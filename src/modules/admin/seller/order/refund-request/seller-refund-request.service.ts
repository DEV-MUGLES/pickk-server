import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';

import { RefundRequestsCountOutput } from './dtos';
import { RefundRequestStatus } from '@order/refund-requests/constants';
import { RefundRequestEntity } from '@order/refund-requests/entities';

@Injectable()
export class SellerRefundRequestService {
  constructor(
    @InjectRepository(RefundRequestsRepository)
    private readonly refundRequestsRepository: RefundRequestsRepository
  ) {}

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
    const refundRequests = await this.refundRequestsRepository.find({
      select: ['merchantUid', 'status', 'sellerId'],
      where: {
        merchantUid: In(merchantUids),
      },
    });

    if (refundRequests.some((oi) => oi.sellerId !== sellerId)) {
      const { merchantUid: id } = refundRequests.find(
        (oi) => oi.sellerId !== sellerId
      );
      throw new ForbiddenException(
        `입력된 반품요청 ${id}이 본인의 반품요청이 아닙니다.`
      );
    }

    if (
      refundRequests.some((rr) => rr.status !== RefundRequestStatus.Requested)
    ) {
      const { merchantUid: id } = refundRequests.find(
        (rr) => rr.status !== RefundRequestStatus.Requested
      );
      throw new BadRequestException(
        `입력된 반품신청 ${id}가 요청됨 상태가 아닙니다.`
      );
    }

    await this.refundRequestsRepository
      .createQueryBuilder()
      .update(RefundRequestEntity)
      .set({ status: RefundRequestStatus.Picked, pickedAt: new Date() })
      .where({ id: In(merchantUids) })
      .execute();
  }
}
