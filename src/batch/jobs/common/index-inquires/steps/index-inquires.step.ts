import { Injectable } from '@nestjs/common';

import { InquiriesService } from '@item/inquiries/inquiries.service';
import { InquirySearchService } from '@mcommon/search/inquiry.search.service';

@Injectable()
export class IndexInquiresStep {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly inquirySearchService: InquirySearchService
  ) {}

  async tasklet() {
    const inquiries = await this.inquiriesService.list(null, null, [
      'orderItem',
      'orderItem.order',
      'orderItem.order.buyer',
      'item',
      'user',
    ]);

    await this.inquirySearchService.bulkIndex(inquiries);
    await this.inquirySearchService.enableFielddata('id');
  }
}
