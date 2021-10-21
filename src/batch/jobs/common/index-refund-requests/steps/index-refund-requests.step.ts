import { Injectable } from '@nestjs/common';

import { RefundRequestSearchService } from '@mcommon/search/refund-request.search.service';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

@Injectable()
export class IndexRefundRequestsStep {
  constructor(
    private readonly refundRequestsService: RefundRequestsService,
    private readonly refundRequestSearchService: RefundRequestSearchService
  ) {}

  async tasklet() {
    const refundRequests = await this.refundRequestsService.list(null, null, [
      'order',
      'order.buyer',
      'shipment',
    ]);

    await this.refundRequestSearchService.clear();
    await this.refundRequestSearchService.bulkIndex(refundRequests);
    await this.refundRequestSearchService.enableFielddata('merchantUid');
  }
}
