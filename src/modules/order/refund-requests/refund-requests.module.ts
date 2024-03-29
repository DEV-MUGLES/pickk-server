import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@nestjs-packages/sqs';

import { SearchModule } from '@mcommon/search/search.module';
import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrdersModule } from '@order/orders/orders.module';
import { PointsModule } from '@order/points/points.module';
import { PaymentsModule } from '@payment/payments/payments.module';
import { INDEX_REFUND_REQUESTS_QUEUE } from '@queue/constants';

import { RefundRequestConsumers } from './consumers';
import { RefundRequestsProducer } from './producers';

import { RefundRequestsRepository } from './refund-requests.repository';
import { RefundRequestsService } from './refund-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundRequestsRepository]),
    forwardRef(() => SearchModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => OrderItemsModule),
    PaymentsModule,
    PointsModule,
    forwardRef(() => ExchangeRequestsModule),
    SqsModule.registerQueue({
      name: INDEX_REFUND_REQUESTS_QUEUE,
    }),
  ],
  providers: [
    Logger,
    RefundRequestsService,
    RefundRequestsProducer,
    ...RefundRequestConsumers,
  ],
  exports: [RefundRequestsService, RefundRequestsProducer],
})
export class RefundRequestsModule {}
