import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { InquiriesCountOutput } from '@admin/seller/item/inquiry/dtos';
import { InquiriesRepository } from '@item/inquiries/inquiries.repository';

@Injectable()
export class RootInquiryService {
  constructor(
    @InjectRepository(InquiriesRepository)
    private readonly inquiriesRepository: InquiriesRepository
  ) {}

  async getCount(month = 3): Promise<InquiriesCountOutput> {
    const inquiries = await this.inquiriesRepository.find({
      select: ['createdAt'],
      where: {
        isAnswered: false,
        createdAt: MoreThanOrEqual(dayjs().subtract(month, 'month').toDate()),
      },
    });

    return InquiriesCountOutput.create(0, inquiries);
  }
}
