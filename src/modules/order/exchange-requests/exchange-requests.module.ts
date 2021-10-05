import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE } from '@queue/constants';

import { ProductsModule } from '@item/products/products.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { PaymentsModule } from '@payment/payments/payments.module';

import { SendExchangeRequestedAlimtalkConsumer } from './consumers';
import { ExchangeRequestsProducer } from './producers';

import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { ExchangeRequestsResolver } from './exchange-requests.resolver';
import { ExchangeRequestsService } from './exchange-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRequestsRepository]),
    OrderItemsModule,
    SqsModule.registerQueue({
      name: SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
    }),
    ProductsModule,
    PaymentsModule,
  ],
  providers: [
    ExchangeRequestsResolver,
    ExchangeRequestsService,
    ExchangeRequestsProducer,
    SendExchangeRequestedAlimtalkConsumer,
  ],
  exports: [ExchangeRequestsService],
})
export class ExchangeRequestsModule {}
