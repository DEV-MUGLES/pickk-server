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
  OrderVbankReceiptsRepository,
} from '@order/orders/orders.repository';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';
import { ProductsModule } from '@item/products/products.module';

import { ProcessDelayedExchangeRequestsJobProviders } from './process-delayed-exchange-requests';
import { ProcessDelayedOrderItemsJobProviders } from './process-delayed-order-items';
import { ProcessDelayedRefundRequestsJobProviders } from './process-delayed-refund-requests';
import { SendDelayedOrderItemsAlimtalkJobProviders } from './send-delayed-order-items-alimtalk';
import { SendDelayedExchangeRequestsAlimtalkJobProviders } from './send-delayed-exchange-requests-alimtalk';
import { SendDelayedRefundRequestsAlimtalkJobProviders } from './send-delayed-refund-requests-alimtalk';
import { ConfirmOrderItemsJobProviders } from './confirm-order-items';
import { RemoveExpiredOrdersJobProviders } from './remove-expired-orders';
import { RemovePayingOrdersJobProviders } from './remove-paying-orders';
import { SendOrdersCreatedAlimtalkJobProviders } from './send-order-created-alimtalk';
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
      OrderVbankReceiptsRepository,
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
    ...ConfirmOrderItemsJobProviders,
    ...ProcessDelayedOrderItemsJobProviders,
    ...ProcessDelayedExchangeRequestsJobProviders,
    ...ProcessDelayedRefundRequestsJobProviders,
    ...RemoveExpiredOrdersJobProviders,
    ...RemovePayingOrdersJobProviders,
    ...RemoveNotReferedOrderRelatedEntitiesJobProviders,
    ...SendDelayedOrderItemsAlimtalkJobProviders,
    ...SendDelayedExchangeRequestsAlimtalkJobProviders,
    ...SendDelayedRefundRequestsAlimtalkJobProviders,
    ...SendOrdersCreatedAlimtalkJobProviders,
  ],
})
export class OrderJobsModule {}
