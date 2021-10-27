import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import {
  OrderBuyersRepository,
  OrderReceiversRepository,
  OrderRefundAccountsRepository,
  OrdersRepository,
} from '@order/orders/orders.repository';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';
import { ProductsModule } from '@item/products/products.module';

import {
  ProcessDelayedExchangeRequestsJob,
  UpdateDelayedExchangeRequestsStep,
} from './process-delayed-exchange-requests';
import {
  UpdateDelayedOrderItemsStep,
  ProcessDelayedOrderItemsJob,
} from './process-delayed-order-items';
import {
  ProcessDelayedRefundRequestsJob,
  UpdateDelayedRefundRequestsStep,
} from './process-delayed-refund-requests';
import {
  SendDelayedOrderItemsAlimtalkJob,
  SendDelayedOrderItemsAlimtalkStep,
} from './send-delayed-order-items-alimtalk';
import {
  SendDelayedExchangeRequestsAlimtalkJob,
  SendDelayedExchangeRequestsAlimtalkStep,
} from './send-delayed-exchange-requests-alimtalk';
import {
  SendDelayedRefundRequestsAlimtalkJob,
  SendDelayedRefundRequestsAlimtalkStep,
} from './send-delayed-refund-requests-alimtalk';
import {
  ConfirmExchangedOrderItemsStep,
  ConfirmOrderItemsJob,
  ConfirmOrderItemsStep,
} from './confirm-order-items';
import {
  RemoveExpiredOrdersJob,
  RemoveExpiredOrdersStep,
} from './remove-expired-orders';
import {
  RemovePayingOrdersJob,
  RemovePayingOrdersStep,
} from './remove-paying-orders';
import {
  SendOrdersCreatedAlimtalkJob,
  SendOrdersCreatedAlimtalkStep,
} from './send-order-created-alimtalk';
import { RemoveNotReferedOrderRelatedEntitiesJobProviders } from './remove-not-refered-order-related-entities';

import { OrderJobsController } from './order-jobs.controller';
import { OrderJobsService } from './order-jobs.service';

// TODO: job,step provider inject 개선하기
@Module({
  imports: [
    JobsModule,
    TypeOrmModule.forFeature([
      OrderItemsRepository,
      RefundRequestsRepository,
      ExchangeRequestsRepository,
      OrdersRepository,
      OrderBuyersRepository,
      OrderReceiversRepository,
      OrderRefundAccountsRepository,
    ]),
    ProductsModule,
    OrderItemsModule,
    RefundRequestsModule,
    ExchangeRequestsModule,
  ],
  controllers: [OrderJobsController],
  providers: [
    OrderJobsService,
    BatchWorker,
    ProcessDelayedOrderItemsJob,
    ProcessDelayedExchangeRequestsJob,
    ProcessDelayedRefundRequestsJob,
    SendDelayedOrderItemsAlimtalkJob,
    SendDelayedExchangeRequestsAlimtalkJob,
    SendDelayedRefundRequestsAlimtalkJob,
    UpdateDelayedOrderItemsStep,
    UpdateDelayedRefundRequestsStep,
    UpdateDelayedExchangeRequestsStep,
    SendDelayedOrderItemsAlimtalkStep,
    SendDelayedExchangeRequestsAlimtalkStep,
    SendDelayedRefundRequestsAlimtalkStep,
    ConfirmOrderItemsJob,
    ConfirmOrderItemsStep,
    ConfirmExchangedOrderItemsStep,
    RemoveExpiredOrdersJob,
    RemoveExpiredOrdersStep,
    RemovePayingOrdersJob,
    RemovePayingOrdersStep,
    SendOrdersCreatedAlimtalkJob,
    SendOrdersCreatedAlimtalkStep,
    ...RemoveNotReferedOrderRelatedEntitiesJobProviders,
  ],
})
export class OrderJobsModule {}
