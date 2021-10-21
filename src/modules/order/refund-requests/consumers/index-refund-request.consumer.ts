import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { RefundRequestSearchService } from '@mcommon/search/refund-request.search.service';
import { INDEX_REFUND_REQUEST_QUEUE } from '@queue/constants';
import { IndexRefundRequestMto } from '@queue/mtos';

@SqsProcess(INDEX_REFUND_REQUEST_QUEUE)
export class IndexRefundRequestConsumer extends BaseConsumer {
  constructor(
    private readonly refundRequestSearchService: RefundRequestSearchService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async indexRefundRequest(message: AWS.SQS.Message) {
    const { merchantUid } = JSON.parse(message.Body) as IndexRefundRequestMto;

    await this.refundRequestSearchService.index(merchantUid);
  }
}
