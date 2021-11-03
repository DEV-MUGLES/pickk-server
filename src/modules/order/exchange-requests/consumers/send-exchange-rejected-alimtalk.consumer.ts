import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_REJECTED_ALIMTALK_QUEUE } from '@queue/constants';
import { AlimtalkService } from '@providers/sens';
import { SendExchangeRejectedAlimtalkMto } from '@queue/mtos';

import { ExchangeRequestsService } from '../exchange-requests.service';

@SqsProcess(SEND_EXCHANGE_REJECTED_ALIMTALK_QUEUE)
export class SendExchangeRejectedAlimtalkConsumer {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly alimtalkServcie: AlimtalkService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { merchantUid }: SendExchangeRejectedAlimtalkMto = JSON.parse(
      message.Body
    );

    const exchangeRequest = await this.exchangeRequestsService.get(
      merchantUid,
      ['orderItem', 'orderItem.order', 'orderItem.order.buyer']
    );

    await this.alimtalkServcie.sendExchangeRejected(exchangeRequest);
  }
}
