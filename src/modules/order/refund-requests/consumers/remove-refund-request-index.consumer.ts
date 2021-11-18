import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { RefundRequestSearchService } from '@mcommon/search/refund-request.search.service';
import { REMOVE_REFUND_REQUEST_INDEX_QUEUE } from '@queue/constants';
import { RemoveRefundRequestIndexMto } from '@queue/mtos';

@SqsProcess(REMOVE_REFUND_REQUEST_INDEX_QUEUE)
export class RemoveRefundRequestIndexConsumer extends BaseConsumer {
  constructor(
    private readonly refundRequestSearchService: RefundRequestSearchService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async removeIndex(message: AWS.SQS.Message) {
    const { merchantUid }: RemoveRefundRequestIndexMto = JSON.parse(
      message.Body
    );

    await this.refundRequestSearchService.remove(merchantUid);
  }
}
