import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE } from '@queue/constants';

@Injectable()
export class OrderItemsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendExchangeRequestedAlimtalk(
    merchantUid: string,
    exchangeRequestId: number
  ) {
    await this.sqsService.send(SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE, {
      id: merchantUid,
      body: {
        merchantUid,
        exchangeRequestId,
      },
    });
  }
}
