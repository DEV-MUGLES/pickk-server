import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { AlimtalkService } from '@providers/sens';
import { SEND_EXCHANGE_ITEM_RESHIPED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendExchangeItemReshipedAlimtalkMto } from '@queue/mtos';

import { ExchangeRequestsService } from '../exchange-requests.service';

@SqsProcess(SEND_EXCHANGE_ITEM_RESHIPED_ALIMTALK_QUEUE)
export class SendExchangItemReshipedAlimtalkConsumer extends BaseConsumer {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly alimtalkService: AlimtalkService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { merchantUid }: SendExchangeItemReshipedAlimtalkMto = JSON.parse(
      message.Body
    );

    const exchangeRequest = await this.exchangeRequestsService.get(
      merchantUid,
      [
        'reShipment',
        'reShipment.courier',
        'orderItem',
        'orderItem.order',
        'orderItem.order.buyer',
        'orderItem.order.receiver',
      ]
    );

    await this.alimtalkService.sendExchangeItemReshiped(exchangeRequest);
  }
}
