import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { InquiriesRepository } from '@item/inquiries/inquiries.repository';

import { InquiriesCountOutput } from './dtos';

@Injectable()
export class SellerInquiryService {
  constructor(
    @InjectRepository(InquiriesRepository)
    private readonly inquiriesRepository: InquiriesRepository
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
}