import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE } from '@queue/constants';
import { AlimtalkService } from '@providers/sens';
import { SendExchangeRequestedAlimtalkMto } from '@queue/mtos';

import { ExchangeRequestsService } from '../exchange-requests.service';

@SqsProcess(SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE)
export class SendExchangeRequestedAlimtalkConsumer {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly alimtalkServcie: AlimtalkService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { merchantUid }: SendExchangeRequestedAlimtalkMto = JSON.parse(
      message.Body
    );

    const exchangeRequest = await this.exchangeRequestsService.get(
      merchantUid,
      [
        'seller',
        'pickShipment',
        'pickShipment.courier',
        'orderItem',
        'orderItem.order',
        'orderItem.order.buyer',
        'seller.brand',
        'seller.courier',
        'seller.returnAddress',
      ]
    );

    await this.alimtalkServcie.sendExchangeRequested(exchangeRequest);
  }
}
