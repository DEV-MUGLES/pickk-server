import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { RefundRequestSearchService } from '@mcommon/search/refund-request.search.service';
import { INDEX_REFUND_REQUESTS_QUEUE } from '@queue/constants';
import { IndexRefundRequestsMto } from '@queue/mtos';

import { RefundRequestsService } from '../refund-requests.service';

@SqsProcess(INDEX_REFUND_REQUESTS_QUEUE)
export class IndexRefundRequestsConsumer extends BaseConsumer {
  constructor(
    private readonly refundRequestsService: RefundRequestsService,
    private readonly refundRequestSearchService: RefundRequestSearchService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async indexRefundRequest(message: AWS.SQS.Message) {
    const { merchantUids } = JSON.parse(message.Body) as IndexRefundRequestsMto;
    const refundRequests = await this.refundRequestsService.list(
      {
        merchantUidIn: merchantUids,
      },
      null,
      ['order', 'order.buyer', 'shipment']
    );

    await this.refundRequestSearchService.bulkIndex(refundRequests);
  }
}
