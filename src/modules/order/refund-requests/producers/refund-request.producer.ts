import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import { INDEX_REFUND_REQUEST_QUEUE } from '@queue/constants';
import { IndexRefundRequestMto } from '@queue/mtos';

@Injectable()
export class RefundRequestsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async indexRefundRequest(merchantUid: string) {
    await this.sqsService.send<IndexRefundRequestMto>(
      INDEX_REFUND_REQUEST_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUid,
        },
      }
    );
  }
}
