import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { INDEX_INQUIRY_QUEUE } from '@queue/constants';
import { IndexInquiryMto } from '@queue/mtos';

import { InquirySearchService } from '@mcommon/search/inquiry.search.service';

@SqsProcess(INDEX_INQUIRY_QUEUE)
export class IndexInquiryConsumer extends BaseConsumer {
  constructor(
    private readonly inquirySearchService: InquirySearchService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async indexInquiry(message: AWS.SQS.Message) {
    const { id } = JSON.parse(message.Body) as IndexInquiryMto;
    await this.inquirySearchService.index(id);
  }
}
