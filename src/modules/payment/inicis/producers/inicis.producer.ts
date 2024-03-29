import { Injectable } from '@nestjs/common';
import { SqsService } from '@nestjs-packages/sqs';

import { getRandomUuid } from '@common/helpers';
import {
  PROCESS_VBANK_PAID_ORDER_QUEUE,
  SEND_VBANK_PAID_ALIMTALK_QUEUE,
} from '@queue/constants';
import {
  ProcessVbankPaidOrderMto,
  SendVbankPaidAlimtalkMto,
} from '@queue/mtos';

@Injectable()
export class InicisProducer {
  constructor(private readonly sqsService: SqsService) {}

  async processVbankPaidOrder(merchantUid: string) {
    await this.sqsService.send<ProcessVbankPaidOrderMto>(
      PROCESS_VBANK_PAID_ORDER_QUEUE,
      {
        id: getRandomUuid(),
        body: { merchantUid },
      }
    );
  }

  async sendVbankPaidAlimtalk(merchantUid: string) {
    await this.sqsService.send<SendVbankPaidAlimtalkMto>(
      SEND_VBANK_PAID_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUid,
        },
      }
    );
  }
}
