import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import {
  SEND_EXCHANGE_ITEM_RESHIPED_ALIMTALK_QUEUE,
  SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
} from '@queue/constants';

import { ProductsModule } from '@item/products/products.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrdersModule } from '@order/orders/orders.module';
import { PaymentsModule } from '@payment/payments/payments.module';

import { ExchangeRequestsConsumers } from './consumers';
import { ExchangeRequestsProducer } from './producers';

import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { ExchangeRequestsResolver } from './exchange-requests.resolver';
import { ExchangeRequestsService } from './exchange-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRequestsRepository]),
    OrdersModule,
    OrderItemsModule,
    SqsModule.registerQueue(
      {
        name: SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
      },
      {
        name: SEND_EXCHANGE_ITEM_RESHIPED_ALIMTALK_QUEUE,
      }
    ),
    ProductsModule,
    PaymentsModule,
  ],
  providers: [
    Logger,
    ExchangeRequestsResolver,
    ExchangeRequestsService,
    ExchangeRequestsProducer,
    ...ExchangeRequestsConsumers,
  ],
  exports: [ExchangeRequestsService, ExchangeRequestsProducer],
})
export class ExchangeRequestsModule {}
