import { IndexExchangeRequestsConsumer } from './index-exchange-requests.consumer';
import { SendExchangeRequestedAlimtalkConsumer } from './send-exchange-requested-alimtalk.consumer';
import { SendExchangItemReshipedAlimtalkConsumer } from './send-exchange-item-reshiped-alimtalk.consumer';

export const ExchangeRequestsConsumers = [
  SendExchangeRequestedAlimtalkConsumer,
  SendExchangItemReshipedAlimtalkConsumer,
  IndexExchangeRequestsConsumer,
];
