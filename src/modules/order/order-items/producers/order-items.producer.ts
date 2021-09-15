import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendExchangeRequestedAlimtalkMto } from '@queue/mtos';

@Injectable()
export class OrderItemsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendExchangeRequestedAlimtalk(merchantUid: string) {
    await this.sqsService.send<SendExchangeRequestedAlimtalkMto>(
      SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
      {
        id: merchantUid.toString(),
        body: {
          merchantUid,
        },
      }
    );
  }
}
