import { ProcessVbankPaidOrderConsumer } from './process-vbank-paid-order.consumer';
import { SendCancelOrderApprovedAlimtalkConsumer } from './send-cancel-order-approved-alimtalk.consumer';
import { SendVbankPaidAlimtalkConsumer } from './send-vbank-paid-alimtalk.consumer';
import { SendOrderCompletedAlimtalkConsumer } from './send-order-completed-alimtalk.consumer';
import { SendRefundRequestedAlimtalkConsumer } from './send-refund-requested-alimtalk.consumer';

export const OrdersConsumers = [
  ProcessVbankPaidOrderConsumer,
  SendCancelOrderApprovedAlimtalkConsumer,
  SendVbankPaidAlimtalkConsumer,
  SendOrderCompletedAlimtalkConsumer,
  SendRefundRequestedAlimtalkConsumer,
];
