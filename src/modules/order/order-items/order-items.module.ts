import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import { SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE } from '@queue/constants';

import { ProductsModule } from '@item/products/products.module';

import { OrderItemsProducer } from './producers';

import { OrderItemsProcessResolver } from './order-items.process.resolver';
import { OrderItemsRepository } from './order-items.repository';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemsRepository]),
    ProductsModule,
    SqsModule.registerQueue({
      name: SEND_EXCHANGE_REQUESTED_ALIMTALK_QUEUE,
    }),
  ],
  providers: [OrderItemsProcessResolver, OrderItemsService, OrderItemsProducer],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
