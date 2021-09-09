import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { PROCESS_VBANK_PAID_ORDER_QUEUE } from '@queue/constants';
import { ProcessVbankPaidOrderMto } from '@queue/mtos';

@Injectable()
export class InicisProducer {
  constructor(private readonly sqsService: SqsService) {}

  async processVbankPaidOrder(merchantUid: string) {
    await this.sqsService.send<ProcessVbankPaidOrderMto>(
      PROCESS_VBANK_PAID_ORDER_QUEUE,
      {
        id: merchantUid,
        body: { merchantUid },
      }
    );
  }
}
