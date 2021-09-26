import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { InquiriesRepository } from '@item/inquiries/inquiries.repository';
import { InquiriesService } from '@item/inquiries/inquiries.service';

import { InquiriesCountOutput } from './dtos';

@Injectable()
export class SellerInquiryService {
  constructor(
    @InjectRepository(InquiriesRepository)
    private readonly inquiriesRepository: InquiriesRepository,
    private readonly inquiriesService: InquiriesService
  ) {}

  async getCount(sellerId: number, month = 3): Promise<InquiriesCountOutput> {
    const inquiries = await this.inquiriesRepository.find({
      select: ['createdAt'],
      where: {
        sellerId,
        isAnswered: false,
        createdAt: MoreThanOrEqual(dayjs().subtract(month, 'month').toDate()),
      },
    });

    return InquiriesCountOutput.create(sellerId, inquiries);
  }

  async checkBelongsTo(id: number, sellerId): Promise<void> {
    const inquiry = await this.inquiriesService.get(id);
    if (inquiry.sellerId !== sellerId) {
      throw new ForbiddenException('답변 권한이 없습니다.');
    }
  }

  async checkAnswerBelongsTo(id: number, sellerId): Promise<void> {
    const inquiryAnswer = await this.inquiriesService.getAnswer(id, [
      'inquiry',
    ]);
    if (inquiryAnswer.inquiry.sellerId !== sellerId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
  }
}
