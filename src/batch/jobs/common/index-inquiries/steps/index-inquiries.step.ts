import { Injectable } from '@nestjs/common';

import { INQUIRY_SEARCH_INDEX_RELATIONS } from '@mcommon/search/constants';
import { InquirySearchService } from '@mcommon/search/inquiry.search.service';
import { InquiriesService } from '@item/inquiries/inquiries.service';

@Injectable()
export class IndexInquiriesStep {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly inquirySearchService: InquirySearchService
  ) {}

  async tasklet() {
    const inquiries = await this.inquiriesService.list(
      null,
      null,
      INQUIRY_SEARCH_INDEX_RELATIONS
    );

    await this.inquirySearchService.clear();
    await this.inquirySearchService.bulkIndex(inquiries);
    await this.inquirySearchService.enableFielddata('id');
  }
}
