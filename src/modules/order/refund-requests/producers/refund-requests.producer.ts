import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import { INDEX_REFUND_REQUESTS_QUEUE } from '@queue/constants';
import { IndexRefundRequestsMto } from '@queue/mtos';

@Injectable()
export class RefundRequestsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async indexRefundRequests(merchantUids: string[]) {
    await this.sqsService.send<IndexRefundRequestsMto>(
      INDEX_REFUND_REQUESTS_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUids,
        },
      }
    );
  }
}
