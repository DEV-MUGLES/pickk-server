import { IndexRefundRequestsConsumer } from './index-refund-requests.consumer';
import { RemoveRefundRequestIndexConsumer } from './remove-refund-request-index.consumer';

export const RefundRequestConsumers = [
  IndexRefundRequestsConsumer,
  RemoveRefundRequestIndexConsumer,
];
