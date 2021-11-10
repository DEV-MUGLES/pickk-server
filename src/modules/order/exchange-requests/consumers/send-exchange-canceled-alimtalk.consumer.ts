import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_CANCELED_ALIMTALK_QUEUE } from '@queue/constants';
import { AlimtalkService } from '@providers/sens';
import { SendExchangeCanceledAlimtalkMto } from '@queue/mtos';

import { ExchangeRequestsService } from '../exchange-requests.service';

@SqsProcess(SEND_EXCHANGE_CANCELED_ALIMTALK_QUEUE)
export class SendExchangeCanceledAlimtalkConsumer {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly alimtalkService: AlimtalkService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { merchantUid }: SendExchangeCanceledAlimtalkMto = JSON.parse(
      message.Body
    );

    const exchangeRequest = await this.exchangeRequestsService.get(
      merchantUid,
      ['orderItem', 'orderItem.order', 'orderItem.order.buyer']
    );

    await this.alimtalkService.sendExchangeCanceled(exchangeRequest);
  }
}
