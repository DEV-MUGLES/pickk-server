import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { INDEX_EXCHANGE_REQUESTS_QUEUE } from '@queue/constants';
import { ExchangeRequestSearchService } from '@mcommon/search/exchange-request.search.service';

import { ExchangeRequestsService } from '../exchange-requests.service';
import { IndexExchangeRequestsMto } from '@queue/mtos';

@SqsProcess(INDEX_EXCHANGE_REQUESTS_QUEUE)
export class IndexExchangeRequestsConsumer extends BaseConsumer {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly exchangeRequestSearchService: ExchangeRequestSearchService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async indexExchangeRequests(message: AWS.SQS.Message) {
    const { merchantUids } = JSON.parse(
      message.Body
    ) as IndexExchangeRequestsMto;
    const exchangeRequests = await this.exchangeRequestsService.list(
      { merchantUidIn: merchantUids },
      null,
      [
        'orderItem',
        'orderItem.order',
        'orderItem.order.buyer',
        'reShipment',
        'pickShipment',
      ]
    );

    await this.exchangeRequestSearchService.bulkIndex(exchangeRequests);
  }
}
