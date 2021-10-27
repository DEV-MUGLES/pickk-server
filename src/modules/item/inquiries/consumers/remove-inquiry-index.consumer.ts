import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { REMOVE_INQUIRY_INDEX_QUEUE } from '@queue/constants';
import { RemoveInquiryIndexMto } from '@queue/mtos';

import { InquirySearchService } from '@mcommon/search/inquiry.search.service';

@SqsProcess(REMOVE_INQUIRY_INDEX_QUEUE)
export class RemoveInquiryIndexConsumer extends BaseConsumer {
  constructor(
    private readonly inquirySearchService: InquirySearchService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async indexInquiry(message: AWS.SQS.Message) {
    const { id } = JSON.parse(message.Body) as RemoveInquiryIndexMto;
    await this.inquirySearchService.remove(id);
  }
}
