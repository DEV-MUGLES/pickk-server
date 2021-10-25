import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  INDEX_EXCHANGE_REQUESTS_QUEUE,
  SEND_EXCHANGE_ITEM_RESHIPED_ALIMTALK_QUEUE,
  SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
} from '@queue/constants';
import {
  IndexExchangeRequestsMto,
  SendExchangeItemReshipedAlimtalkMto,
  SendExchangeRequestedAlimtalkMto,
} from '@queue/mtos';

@Injectable()
export class ExchangeRequestsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendExchangeRequestedAlimtalk(merchantUid: string) {
    await this.sqsService.send<SendExchangeRequestedAlimtalkMto>(
      SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUid,
        },
      }
    );
  }

  async sendExchangeItemReshipedAlimtalk(merchantUid: string) {
    await this.sqsService.send<SendExchangeItemReshipedAlimtalkMto>(
      SEND_EXCHANGE_ITEM_RESHIPED_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUid,
        },
      }
    );
  }

  async indexExchangeRequests(merchantUids: string[]) {
    await this.sqsService.send<IndexExchangeRequestsMto>(
      INDEX_EXCHANGE_REQUESTS_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUids,
        },
      }
    );
  }
}
