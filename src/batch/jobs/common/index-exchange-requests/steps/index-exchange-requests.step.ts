import { Injectable } from '@nestjs/common';

import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';
import { ExchangeRequestSearchService } from '@mcommon/search/exchange-request.search.service';

@Injectable()
export class IndexExchangeRequestsStep {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly exchangeRequestSearchService: ExchangeRequestSearchService
  ) {}

  async tasklet() {
    const exchangeRequests = await this.exchangeRequestsService.list(
      null,
      null,
      [
        'orderItem',
        'orderItem.order',
        'orderItem.order.buyer',
        'pickShipment',
        'reShipment',
      ]
    );

    await this.exchangeRequestSearchService.bulkIndex(exchangeRequests);
    await this.exchangeRequestSearchService.enableFielddata('merchantUid');
  }
}
